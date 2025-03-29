const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const Performance = require('../models/Performance');

/**
 * @route   GET /api/companies
 * @desc    Get all companies
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find().sort({ name: 1 });
    res.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/companies/:id
 * @desc    Get company by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findOne({ companyId: req.params.id });
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    res.json(company);
  } catch (error) {
    console.error(`Error fetching company ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/companies/:id/performances
 * @desc    Get performances for a specific company
 * @access  Public
 */
router.get('/:id/performances', async (req, res) => {
  try {
    const company = await Company.findOne({ companyId: req.params.id });
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    // Get query parameters
    const { past } = req.query;
    const now = new Date();
    
    let query = { company: req.params.id };
    
    // Filter by past or current/upcoming
    if (past === 'true') {
      query.endDate = { $lt: now };
    } else {
      query.endDate = { $gte: now };
    }
    
    const performances = await Performance.find(query).sort({ startDate: 1 });
    
    res.json(performances);
  } catch (error) {
    console.error(`Error fetching performances for company ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

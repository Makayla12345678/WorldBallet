const express = require('express');
const router = express.Router();
const Performance = require('../models/Performance');
const Company = require('../models/Company');

/**
 * @route   GET /api/performances
 * @desc    Get all performances with optional filtering
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    // Get query parameters
    const { current, upcoming, past, limit } = req.query;
    const now = new Date();
    
    let query = {};
    
    // Filter by performance status
    if (current === 'true') {
      query.startDate = { $lte: now };
      query.endDate = { $gte: now };
    } else if (upcoming === 'true') {
      query.startDate = { $gt: now };
    } else if (past === 'true') {
      query.endDate = { $lt: now };
    }
    
    // Create base query
    let performanceQuery = Performance.find(query).sort({ startDate: 1 });
    
    // Apply limit if provided
    if (limit) {
      performanceQuery = performanceQuery.limit(parseInt(limit));
    }
    
    // Execute query
    const performances = await performanceQuery;
    
    // Enhance performances with company information
    const enhancedPerformances = await Promise.all(
      performances.map(async (performance) => {
        const company = await Company.findOne({ companyId: performance.company });
        return {
          ...performance.toObject(),
          companyName: company ? company.name : 'Unknown Company',
          companyShortName: company ? company.shortName : 'Unknown'
        };
      })
    );
    
    res.json(enhancedPerformances);
  } catch (error) {
    console.error('Error fetching performances:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/performances/current
 * @desc    Get all current performances
 * @access  Public
 */
router.get('/current', async (req, res) => {
  try {
    const now = new Date();
    
    const performances = await Performance.find({
      startDate: { $lte: now },
      endDate: { $gte: now }
    }).sort({ startDate: 1 });
    
    // Enhance performances with company information
    const enhancedPerformances = await Promise.all(
      performances.map(async (performance) => {
        const company = await Company.findOne({ companyId: performance.company });
        return {
          ...performance.toObject(),
          companyName: company ? company.name : 'Unknown Company',
          companyShortName: company ? company.shortName : 'Unknown'
        };
      })
    );
    
    res.json(enhancedPerformances);
  } catch (error) {
    console.error('Error fetching current performances:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/performances/upcoming
 * @desc    Get all upcoming performances
 * @access  Public
 */
router.get('/upcoming', async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    const performances = await Performance.find({
      startDate: { $gt: now, $lte: thirtyDaysFromNow }
    }).sort({ startDate: 1 });
    
    // Enhance performances with company information
    const enhancedPerformances = await Promise.all(
      performances.map(async (performance) => {
        const company = await Company.findOne({ companyId: performance.company });
        return {
          ...performance.toObject(),
          companyName: company ? company.name : 'Unknown Company',
          companyShortName: company ? company.shortName : 'Unknown'
        };
      })
    );
    
    res.json(enhancedPerformances);
  } catch (error) {
    console.error('Error fetching upcoming performances:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/performances/:id
 * @desc    Get performance by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const performance = await Performance.findById(req.params.id);
    
    if (!performance) {
      return res.status(404).json({ message: 'Performance not found' });
    }
    
    // Get company information
    const company = await Company.findOne({ companyId: performance.company });
    
    // Enhance performance with company information
    const enhancedPerformance = {
      ...performance.toObject(),
      companyName: company ? company.name : 'Unknown Company',
      companyShortName: company ? company.shortName : 'Unknown'
    };
    
    res.json(enhancedPerformance);
  } catch (error) {
    console.error(`Error fetching performance ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

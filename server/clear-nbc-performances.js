/**
 * Script to clear National Ballet of Canada performances from the database
 * This will allow us to re-scrape with the updated scraper
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Performance = require('./models/Performance');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const clearNBCPerformances = async () => {
  try {
    console.log('Clearing National Ballet of Canada performances from database...');
    
    // Delete all performances with company = 'nbc'
    const result = await Performance.deleteMany({ company: 'nbc' });
    
    console.log(`Deleted ${result.deletedCount} NBC performances from database`);
    
    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error clearing NBC performances:', error);
    process.exit(1);
  }
};

// Run the function
clearNBCPerformances();

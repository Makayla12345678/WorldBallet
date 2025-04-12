/**
 * Script to run the ABT scraper and save the results to the database
 */

// Import required modules
const mongoose = require('mongoose');
const { saveCompanyInfo, savePerformances } = require('./scrapers/index');
const abtScraper = require('./scrapers/abt');
require('dotenv').config();

// Main function to run the ABT scraper
(async () => {
  try {
    console.log('Running ABT scraper...');
    
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    
    // Scrape company info
    console.log('Scraping company info...');
    const companyInfo = await abtScraper.scrapeCompanyInfo();
    console.log('Company info scraped successfully');
    
    // Save company info to database
    console.log('Saving company info to database...');
    await saveCompanyInfo('abt', companyInfo);
    console.log('Company info saved successfully');
    
    // Scrape performances
    console.log('Scraping performances...');
    const performances = await abtScraper.scrapePerformances();
    console.log(`Found ${performances.length} performances`);
    
    // Save performances to database
    console.log('Saving performances to database...');
    await savePerformances('abt', performances);
    console.log('Performances saved successfully');
    
    console.log('ABT scraper completed successfully');
    
    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error running ABT scraper:', error);
    
    // Close database connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('Database connection closed');
    }
    
    process.exit(1);
  }
})();

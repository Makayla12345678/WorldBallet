/**
 * Script to run the Royal Ballet scraper and save the results to the database
 */

// Import required modules
const mongoose = require('mongoose');
const path = require('path');
const { saveCompanyInfo, savePerformances } = require('./scrapers/index');
const rbScraper = require('./scrapers/rb');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

// Main function to run the Royal Ballet scraper
(async () => {
  try {
    console.log('Running Royal Ballet scraper...');
    
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    
    // Scrape company info
    console.log('Scraping company info...');
    const companyInfo = await rbScraper.scrapeCompanyInfo();
    console.log('Company info scraped successfully');
    
    // Save company info to database
    console.log('Saving company info to database...');
    await saveCompanyInfo('rb', companyInfo);
    console.log('Company info saved successfully');
    
    // Scrape performances
    console.log('Scraping performances...');
    const performances = await rbScraper.scrapePerformances();
    console.log(`Found ${performances.length} performances`);
    
    // Save performances to database
    console.log('Saving performances to database...');
    await savePerformances('rb', performances);
    console.log('Performances saved successfully');
    
    console.log('Royal Ballet scraper completed successfully');
    
    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error running Royal Ballet scraper:', error);
    
    // Close database connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('Database connection closed');
    }
    
    process.exit(1);
  }
})();

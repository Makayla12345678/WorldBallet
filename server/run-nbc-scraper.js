/**
 * Script to run the NBC scraper and save the results to the database
 * This allows us to test the scraper without restarting the entire server
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const nbcScraper = require('./scrapers/nbc');
const { saveCompanyInfo, savePerformances } = require('./scrapers/index');
const connectDB = require('./config/db');
const Performance = require('./models/Performance');

// Load environment variables
dotenv.config({ path: __dirname + '/.env' });

// Connect to MongoDB
connectDB();

const runNBCScraper = async () => {
  try {
    console.log('Running NBC scraper...');
    
    // Scrape company info
    console.log('Scraping company info...');
    const companyInfo = await nbcScraper.scrapeCompanyInfo();
    
    // Save company info to database
    await saveCompanyInfo('nbc', companyInfo);
    
    // Scrape performances
    console.log('Scraping performances...');
    const performances = await nbcScraper.scrapePerformances();
    
    // Save performances to database
    await savePerformances('nbc', performances);
    
    // Update performance flags (current, next)
    await Performance.updatePerformanceFlags('nbc');
    
    console.log('NBC scraper completed successfully');
    
    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error running NBC scraper:', error);
    process.exit(1);
  }
};

// Run the function
runNBCScraper();

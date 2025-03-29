/**
 * World Ballets - Manual Scraper
 * 
 * This script runs the scraper manually without starting the full server.
 * It's useful for testing the scraper functionality.
 * 
 * Usage: node scrape.js [companyId]
 * 
 * Examples:
 *   node scrape.js         # Scrape all companies
 *   node scrape.js nbc     # Scrape only National Ballet of Canada
 *   node scrape.js abt     # Scrape only American Ballet Theatre
 */

require('dotenv').config();
const mongoose = require('mongoose');
const scraper = require('./scrapers/index');

// Get company ID from command line arguments
const companyId = process.argv[2];

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('MongoDB connected');
  
  try {
    if (companyId) {
      // Scrape specific company
      console.log(`Scraping ${companyId}...`);
      await scraper.scrapeCompany(companyId);
      console.log(`Scraping completed for ${companyId}`);
    } else {
      // Scrape all companies
      console.log('Scraping all companies...');
      await scraper.scrapeAll();
      console.log('Scraping completed for all companies');
    }
  } catch (error) {
    console.error('Error during scraping:', error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
    process.exit(0);
  }
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

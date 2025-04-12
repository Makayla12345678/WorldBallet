/**
 * Simple test script to run the Royal Ballet scraper
 */

console.log('Starting test script...');

// Import the Royal Ballet scraper
const rbScraper = require('./scrapers/rb');

// Run the test
const runTest = async () => {
  try {
    console.log('Testing Royal Ballet scraper...');
    
    // Scrape company info
    console.log('Scraping company info...');
    const companyInfo = await rbScraper.scrapeCompanyInfo();
    console.log('Company info:', companyInfo);
    
    // Scrape performances
    console.log('Scraping performances...');
    const performances = await rbScraper.scrapePerformances();
    console.log(`Found ${performances.length} performances`);
    
    // Display each performance
    performances.forEach((performance, index) => {
      console.log(`- ${performance.title} (${performance.startDate} to ${performance.endDate})`);
    });
    
    console.log('Test completed successfully');
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Run the test
runTest();

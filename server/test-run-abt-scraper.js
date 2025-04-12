/**
 * Simple test script to run the ABT scraper
 */

console.log('Starting test script...');

// Import the ABT scraper
const abtScraper = require('./scrapers/abt');

// Run the test
const runTest = async () => {
  try {
    console.log('Testing ABT scraper...');
    
    // Scrape company info
    console.log('Scraping company info...');
    const companyInfo = await abtScraper.scrapeCompanyInfo();
    console.log('Company info:', companyInfo);
    
    // Scrape performances
    console.log('Scraping performances...');
    const performances = await abtScraper.scrapePerformances();
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

/**
 * Simple test script to run the Stuttgart Ballet scraper
 */

console.log('Starting test script...');

// Import the Stuttgart Ballet scraper
const stuttgartScraper = require('./scrapers/stuttgart');

// Run the test
const runTest = async () => {
  try {
    console.log('Testing Stuttgart Ballet scraper...');
    
    // Scrape company info
    console.log('Scraping company info...');
    const companyInfo = await stuttgartScraper.scrapeCompanyInfo();
    console.log('Company info:', companyInfo);
    
    // Scrape performances
    console.log('Scraping performances...');
    const performances = await stuttgartScraper.scrapePerformances();
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

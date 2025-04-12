const bostonScraper = require('./scrapers/boston');

/**
 * Test script for Boston Ballet scraper
 */
const testBostonScraper = async () => {
  console.log('Starting test script...');
  console.log('Testing Boston Ballet scraper...');
  
  try {
    // Test company info scraper
    console.log('Scraping company info...');
    const companyInfo = await bostonScraper.scrapeCompanyInfo();
    console.log('Company info:', companyInfo);
    
    // Test performances scraper
    console.log('Scraping performances...');
    const performances = await bostonScraper.scrapePerformances();
    
    console.log(`Found ${performances.length} performances`);
    
    // Print details of each performance
    performances.forEach((performance, index) => {
      console.log(`- ${performance.title} (${performance.startDate} to ${performance.endDate})`);
      console.log(`  Description: ${performance.description.substring(0, 100)}...`);
      console.log(`  Image: ${performance.image}`);
      console.log('');
    });
    
    console.log('Test completed successfully');
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Run the test
testBostonScraper();

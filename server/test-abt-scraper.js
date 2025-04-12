/**
 * Test script for the ABT scraper
 * This script runs the ABT scraper and displays the results
 */

const abtScraper = require('./scrapers/abt');

/**
 * Run the test
 */
const runTest = async () => {
  try {
    console.log('Testing ABT scraper...');
    
    // Scrape company info
    console.log('Scraping company info...');
    const companyInfo = await abtScraper.scrapeCompanyInfo();
    console.log('Company info:', companyInfo);
    console.log('\n');
    
    // Scrape performances
    console.log('Scraping performances...');
    const performances = await abtScraper.scrapePerformances();
    
    console.log(`Found ${performances.length} performances`);
    
    // Display each performance
    performances.forEach((performance, index) => {
      console.log(`- ${performance.title} (${performance.startDate} to ${performance.endDate})`);
      console.log(`  Description: ${performance.description.substring(0, 100)}...`);
      console.log(`  Image: ${performance.image}`);
      console.log(`  Video: ${performance.videoUrl || 'None'}`);
      console.log('');
    });
    
    console.log('Test completed successfully');
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Run the test
runTest();

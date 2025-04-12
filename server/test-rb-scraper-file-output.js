const fs = require('fs').promises;
const path = require('path');
const rbScraper = require('./scrapers/rb');

async function runTest() {
  try {
    console.log('Testing Royal Ballet scraper...');
    
    // Scrape company info
    console.log('\nScraping company info...');
    let companyInfo;
    try {
      companyInfo = await rbScraper.scrapeCompanyInfo();
      await fs.writeFile(
        path.join(__dirname, 'rb-company-info.json'),
        JSON.stringify(companyInfo, null, 2)
      );
      console.log('Company info saved to rb-company-info.json');
    } catch (companyError) {
      console.error('Error scraping company info:', companyError);
    }
    
    // Scrape performances
    console.log('\nScraping performances...');
    let performances;
    try {
      performances = await rbScraper.scrapePerformances();
      await fs.writeFile(
        path.join(__dirname, 'rb-performances.json'),
        JSON.stringify(performances, null, 2)
      );
      console.log('Performances saved to rb-performances.json');
      console.log('Total performances:', performances.length);
    } catch (performancesError) {
      console.error('Error scraping performances:', performancesError);
      if (performancesError.stack) {
        console.error('Stack trace:', performancesError.stack);
      }
    }
    
  } catch (error) {
    console.error('Unexpected error running Royal Ballet scraper:', error);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
  }
}

// Add error event handler for uncaught exceptions
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
  if (error.stack) {
    console.error('Stack trace:', error.stack);
  }
  process.exit(1);
});

runTest();

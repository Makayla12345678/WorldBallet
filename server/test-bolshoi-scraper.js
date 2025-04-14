const bolshoiScraper = require('./scrapers/bolshoi');
const fs = require('fs').promises;

/**
 * Test the Bolshoi Ballet scraper
 */
const testBolshoiScraper = async () => {
  try {
    console.log('Testing Bolshoi Ballet scraper...');
    
    // Test company info scraper
    console.log('\nTesting company info scraper...');
    const companyInfo = await bolshoiScraper.scrapeCompanyInfo();
    console.log('Company info:', JSON.stringify(companyInfo, null, 2));
    
    // Save company info to file
    await fs.writeFile(
      'bolshoi-company-info.json',
      JSON.stringify(companyInfo, null, 2)
    );
    console.log('Company info saved to bolshoi-company-info.json');
    
    // Test performances scraper
    console.log('\nTesting performances scraper...');
    const performances = await bolshoiScraper.scrapePerformances();
    console.log(`Found ${performances.length} performances`);
    console.log('Performances:', JSON.stringify(performances, null, 2));
    
    // Save performances to file
    await fs.writeFile(
      'bolshoi-performances.json',
      JSON.stringify(performances, null, 2)
    );
    console.log('Performances saved to bolshoi-performances.json');
    
    console.log('\nBolshoi Ballet scraper test completed successfully');
  } catch (error) {
    console.error('Error testing Bolshoi Ballet scraper:', error);
  }
};

// Run the test
testBolshoiScraper();

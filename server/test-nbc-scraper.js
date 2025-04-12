const { scrapeCompanyInfo, scrapePerformances } = require('./scrapers/nbc');

async function testNBCScraper() {
  try {
    console.log('Testing NBC scraper...');
    
    // Test company info scraper
    console.log('Scraping company info...');
    const companyInfo = await scrapeCompanyInfo();
    console.log('Company info:', companyInfo);
    
    // Test performances scraper
    console.log('\nScraping performances...');
    const performances = await scrapePerformances();
    console.log(`Found ${performances.length} performances`);
    performances.forEach(p => {
      console.log(`- ${p.title} (${p.startDate} to ${p.endDate})`);
    });
    
    console.log('\nTest completed successfully');
  } catch (error) {
    console.error('Error testing NBC scraper:', error);
  }
}

testNBCScraper();

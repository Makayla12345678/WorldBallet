const { scrapeCompany } = require('./scrapers');

/**
 * Run the Bolshoi Ballet scraper
 */
const runBolshoiScraper = async () => {
  try {
    console.log('Running Bolshoi Ballet scraper...');
    await scrapeCompany('bolshoi');
    console.log('Bolshoi Ballet scraper completed successfully');
  } catch (error) {
    console.error('Error running Bolshoi Ballet scraper:', error);
  }
};

// Run the scraper
runBolshoiScraper();

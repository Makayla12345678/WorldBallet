const nbcScraper = require('./nbc');
const abtScraper = require('./abt');
const Company = require('../models/Company');
const Performance = require('../models/Performance');

/**
 * Scrape all ballet companies
 */
const scrapeAll = async () => {
  console.log('Starting scraping for all companies...');
  
  try {
    // Scrape National Ballet of Canada
    await scrapeCompany('nbc');
    
    // Scrape American Ballet Theatre
    await scrapeCompany('abt');
    
    // TODO: Add other companies as they are implemented
    // await scrapeCompany('pob');
    // await scrapeCompany('bolshoi');
    // await scrapeCompany('royal');
    // await scrapeCompany('stuttgart');
    // await scrapeCompany('boston');
    
    console.log('All companies scraped successfully');
    return true;
  } catch (error) {
    console.error('Error during scraping:', error);
    throw error;
  }
};

/**
 * Scrape a specific ballet company
 * @param {string} companyId - The ID of the company to scrape
 */
const scrapeCompany = async (companyId) => {
  console.log(`Scraping ${companyId}...`);
  
  try {
    let companyInfo;
    let performances;
    
    // Use the appropriate scraper based on company ID
    switch (companyId) {
      case 'nbc':
        companyInfo = await nbcScraper.scrapeCompanyInfo();
        performances = await nbcScraper.scrapePerformances();
        break;
      case 'abt':
        companyInfo = await abtScraper.scrapeCompanyInfo();
        performances = await abtScraper.scrapePerformances();
        break;
      // TODO: Add other companies as they are implemented
      default:
        throw new Error(`Scraper not implemented for company: ${companyId}`);
    }
    
    // Save company info to database
    await saveCompanyInfo(companyId, companyInfo);
    
    // Save performances to database
    await savePerformances(companyId, performances);
    
    // Update performance flags (current, next)
    await Performance.updatePerformanceFlags(companyId);
    
    console.log(`Scraping completed for ${companyId}`);
    return true;
  } catch (error) {
    console.error(`Error scraping ${companyId}:`, error);
    throw error;
  }
};

/**
 * Save company information to database
 * @param {string} companyId - The ID of the company
 * @param {Object} companyInfo - The company information
 */
const saveCompanyInfo = async (companyId, companyInfo) => {
  try {
    // Check if company exists
    let company = await Company.findOne({ companyId });
    
    if (company) {
      // Update existing company
      company.name = companyInfo.name;
      company.shortName = companyInfo.shortName;
      company.description = companyInfo.description;
      company.logo = companyInfo.logo;
      company.website = companyInfo.website;
      company.lastScraped = new Date();
      
      await company.save();
      console.log(`Updated company: ${companyId}`);
    } else {
      // Create new company
      company = new Company({
        companyId,
        name: companyInfo.name,
        shortName: companyInfo.shortName,
        description: companyInfo.description,
        logo: companyInfo.logo,
        website: companyInfo.website
      });
      
      await company.save();
      console.log(`Created new company: ${companyId}`);
    }
    
    return company;
  } catch (error) {
    console.error(`Error saving company info for ${companyId}:`, error);
    throw error;
  }
};

/**
 * Save performances to database
 * @param {string} companyId - The ID of the company
 * @param {Array} performances - Array of performance objects
 */
const savePerformances = async (companyId, performances) => {
  try {
    const now = new Date();
    
    // Process each performance
    for (const performanceData of performances) {
      // Check if performance exists (by title and date range)
      const existingPerformance = await Performance.findOne({
        company: companyId,
        title: performanceData.title,
        startDate: new Date(performanceData.startDate),
        endDate: new Date(performanceData.endDate)
      });
      
      if (existingPerformance) {
        // Update existing performance
        existingPerformance.description = performanceData.description;
        existingPerformance.image = performanceData.image;
        existingPerformance.videoUrl = performanceData.videoUrl;
        existingPerformance.isPast = new Date(performanceData.endDate) < now;
        existingPerformance.lastScraped = new Date();
        
        await existingPerformance.save();
        console.log(`Updated performance: ${performanceData.title}`);
      } else {
        // Create new performance
        const newPerformance = new Performance({
          title: performanceData.title,
          company: companyId,
          startDate: new Date(performanceData.startDate),
          endDate: new Date(performanceData.endDate),
          description: performanceData.description,
          image: performanceData.image,
          videoUrl: performanceData.videoUrl,
          isPast: new Date(performanceData.endDate) < now
        });
        
        await newPerformance.save();
        console.log(`Created new performance: ${performanceData.title}`);
      }
    }
    
    console.log(`Saved ${performances.length} performances for ${companyId}`);
    return true;
  } catch (error) {
    console.error(`Error saving performances for ${companyId}:`, error);
    throw error;
  }
};

module.exports = {
  scrapeAll,
  scrapeCompany
};

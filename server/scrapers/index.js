const nbcScraper = require('./nbc');
const abtScraper = require('./abt');
const rbScraper = require('./rb');
const stuttgartScraper = require('./stuttgart');
const bostonScraper = require('./boston');
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
    
    // Scrape Royal Ballet
    await scrapeCompany('rb');
    
    // Scrape Stuttgart Ballet
    await scrapeCompany('stuttgart');
    
    // Scrape Boston Ballet
    await scrapeCompany('boston');
    
    // TODO: Add other companies as they are implemented
    // await scrapeCompany('pob');
    // await scrapeCompany('bolshoi');
    
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
      case 'rb':
        companyInfo = await rbScraper.scrapeCompanyInfo();
        performances = await rbScraper.scrapePerformances();
        break;
      case 'stuttgart':
        companyInfo = await stuttgartScraper.scrapeCompanyInfo();
        performances = await stuttgartScraper.scrapePerformances();
        break;
      case 'boston':
        companyInfo = await bostonScraper.scrapeCompanyInfo();
        performances = await bostonScraper.scrapePerformances();
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
      // Skip performances with titles that are likely section headers
      if (performanceData.title === "Upcoming Productions" || 
          performanceData.title.includes("Season") || 
          performanceData.title.includes("Productions")) {
        console.log(`Skipping section header: ${performanceData.title}`);
        continue;
      }
      
      // Normalize the title to handle slight variations
      const normalizedTitle = performanceData.title.trim();
      
      // Check if performance exists (by title and approximate date range)
      // This uses a more flexible date matching to catch duplicates with slightly different dates
      const startDate = new Date(performanceData.startDate);
      const endDate = new Date(performanceData.endDate);
      
      // Create date ranges for searching (±3 days)
      const startDateMin = new Date(startDate);
      startDateMin.setDate(startDateMin.getDate() - 3);
      
      const startDateMax = new Date(startDate);
      startDateMax.setDate(startDateMax.getDate() + 3);
      
      const endDateMin = new Date(endDate);
      endDateMin.setDate(endDateMin.getDate() - 3);
      
      const endDateMax = new Date(endDate);
      endDateMax.setDate(endDateMax.getDate() + 3);
      
      // Find existing performance with similar title and date range
      const existingPerformance = await Performance.findOne({
        company: companyId,
        title: normalizedTitle,
        startDate: { $gte: startDateMin, $lte: startDateMax },
        endDate: { $gte: endDateMin, $lte: endDateMax }
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
          title: normalizedTitle,
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
  scrapeCompany,
  saveCompanyInfo,
  savePerformances
};

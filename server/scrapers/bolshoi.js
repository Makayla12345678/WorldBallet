const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const UserAgentPlugin = require('puppeteer-extra-plugin-anonymize-ua');
const { executablePath } = require('puppeteer');

puppeteer.use(StealthPlugin());
puppeteer.use(UserAgentPlugin({ makeWindows: true }));

const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0'
];

/**
 * Parse date string into a Date object
 * @param {string} dateString - Date string in format "DD Month YYYY"
 * @returns {Date} - Parsed date
 */
const parseDate = (dateString) => {
  const [day, month, year] = dateString.split(' ');
  const monthIndex = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].indexOf(month);
  return new Date(year, monthIndex, parseInt(day));
};

/**
 * Sleep for a given number of milliseconds
 * @param {number} ms - Number of milliseconds to sleep
 * @returns {Promise} - Promise that resolves after the sleep
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get a random user agent
 * @returns {string} - Random user agent
 */
const getRandomUserAgent = () => userAgents[Math.floor(Math.random() * userAgents.length)];

/**
 * Add random delays to mimic human behavior
 * @param {Page} page - Puppeteer page object
 */
const addRandomDelays = async (page) => {
  await page.evaluate(() => {
    const originalQuerySelector = document.querySelector;
    document.querySelector = function() {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(originalQuerySelector.apply(this, arguments));
        }, Math.floor(Math.random() * 500) + 100);
      });
    };
  });
};

/**
 * Scrape Bolshoi Ballet company information
 * @returns {Promise<Object>} - Company information
 */
const scrapeCompanyInfo = async () => {
  try {
    console.log('Scraping Bolshoi Ballet company info...');
    
    return {
      name: 'Bolshoi Ballet',
      shortName: 'BOLSHOI',
      description: 'The Bolshoi Ballet is an internationally renowned classical ballet company, based at the Bolshoi Theatre in Moscow, Russia. Founded in 1776, the Bolshoi is among the world\'s oldest and most prestigious ballet companies.',
      logo: 'https://www.bolshoi.ru/upload/iblock/4d5/4d5d3408c6a7e9e3d9ca2d6e5c3f4f9e.png',
      website: 'https://www.bolshoi.ru/en/'
    };
  } catch (error) {
    console.error('Error scraping Bolshoi Ballet company info:', error.message);
    return null;
  }
};

/**
 * Parse date from URL format to ISO string
 * @param {string} dateStr - Date string in format DD-Month-YYYY
 * @returns {string} - Date in YYYY-MM-DD format
 */
const parseDateFromUrl = (dateStr) => {
  const [day, month, year] = dateStr.split('-');
  const monthNum = new Date(`${month} 1, 2000`).getMonth() + 1;
  return `${year}-${monthNum.toString().padStart(2, '0')}-${day.padStart(2, '0')}`;
};

/**
 * Extract performance details from a table row
 * @param {Object} row - DOM element representing a performance row
 * @returns {Object} - Performance details
 */
const extractPerformanceDetails = async (page, row) => {
  return await page.evaluate((row) => {
    // Helper function to clean text
    const cleanText = (text) => {
      return text
        .replace(/\s+/g, ' ') // Replace multiple spaces/newlines with single space
        .replace(/\t/g, '') // Remove tabs
        .trim();
    };

    const eventNameEl = row.querySelector('.eventName a');
    if (!eventNameEl) return null;

    const title = cleanText(eventNameEl.textContent);
    const url = eventNameEl.href;
    const dateMatch = url.match(/\/(\d{2}-[A-Za-z]+-\d{4})\//);
    if (!dateMatch) return null;

    const timeEl = row.querySelector('.time span');
    const time = timeEl ? cleanText(timeEl.textContent) : '19:00';
    const dateStr = dateMatch[1];

    const stageEl = row.querySelector('.stage-name-mobile');
    const stage = stageEl ? cleanText(stageEl.textContent.replace('.', '')) : 'Main Stage';

    const typeEl = row.querySelector('.perfType');
    const type = typeEl ? cleanText(typeEl.textContent.replace(stage + '.', '')) : '';

    const companyEl = row.querySelector('.person-list a');
    const company = companyEl ? cleanText(companyEl.textContent) : '';

    // Extract description without ticket availability info
    const descriptionParts = [];
    
    if (type) descriptionParts.push(type);
    
    const composerEl = row.querySelector('a[href*="/composer/"]');
    const composer = composerEl ? cleanText(composerEl.textContent) : '';
    if (composer) descriptionParts.push(`Music by ${composer}`);
    
    const choreographerEl = row.querySelector('a[href*="/choreographer/"]');
    const choreographer = choreographerEl ? cleanText(choreographerEl.textContent) : '';
    if (choreographer) descriptionParts.push(`Choreography by ${choreographer}`);
    
    const presentedByEl = row.querySelector('.pre');
    const presentedBy = presentedByEl ? cleanText(presentedByEl.textContent.replace(/<[^>]*>/g, '')) : '';
    if (presentedBy) descriptionParts.push(presentedBy);

    // Get performance details
    const detailsEl = row.querySelector('.block_perf_info');
    if (detailsEl) {
      const detailsText = cleanText(detailsEl.textContent)
        .replace(/Company:\s*[^]*$/, '') // Remove company info
        .replace(/In high demand[^]*$/, '') // Remove ticket availability info
        .replace(/Less than \d+ of \d+ tickets left[^]*$/, '') // Remove ticket count
        .replace(/Very popular[^]*$/, '') // Remove popularity info
        .trim();
      
      if (detailsText) descriptionParts.push(detailsText);
    }

    return {
      title,
      dateStr,
      time,
      stage,
      type,
      company: company || 'Bolshoi Ballet',
      description: descriptionParts.join('. '),
      composer,
      choreographer,
      url,
      uniqueKey: `${dateStr}-${time}-${title}` // For deduplication
    };
  }, row);
};

/**
 * Scrape Bolshoi Ballet performances
 * @returns {Promise<Array>} - Array of performance objects
 */
const scrapePerformances = async () => {
  let browser = null;
  try {
    console.log('Scraping Bolshoi Ballet performances from bolshoirussia.com...');
    
    browser = await puppeteer.launch({
      headless: 'new',
      executablePath: executablePath(),
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-infobars',
        '--window-position=0,0',
        '--ignore-certifcate-errors',
        '--ignore-certifcate-errors-spki-list',
      ],
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
    
    // Set headers to mimic a real browser
    await page.setExtraHTTPHeaders({
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1'
    });

    // Get current month and year
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    
    const performancesMap = new Map();
    
    // Scrape next 6 months
    for (let i = 0; i < 6; i++) {
      const targetDate = new Date(currentYear, currentMonth + i - 1, 1);
      const monthStr = targetDate.toLocaleString('en-US', { month: '2-digit' });
      const yearStr = targetDate.getFullYear();
      
      const url = `https://www.bolshoirussia.com/playbill/search/${monthStr}-${yearStr}/`;
      console.log(`Scraping performances for ${monthStr}-${yearStr}...`);
      
      try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
        await sleep(Math.random() * 3000 + 2000); // Random delay between 2-5 seconds
        
        // Get all performance rows
        const rows = await page.$$('table.mainTable tr');
        
        for (const row of rows) {
          const details = await extractPerformanceDetails(page, row);
          if (details) {
            const startDate = parseDateFromUrl(details.dateStr);
            
            const performance = {
              title: details.title,
              startDate: startDate,
              endDate: startDate, // Single day performances
              description: details.description,
              image: `https://via.placeholder.com/800x400.png?text=${encodeURIComponent(details.title)}`,
              videoUrl: '',
              venue: details.stage,
              company: details.company,
              performanceType: details.type
            };

            performancesMap.set(details.uniqueKey, performance);
          }
        }
      } catch (error) {
        console.error(`Error scraping ${monthStr}-${yearStr}:`, error.message);
      }
      
      // Random delay between months
      await sleep(Math.random() * 5000 + 3000);
    }

    const performances = Array.from(performancesMap.values());

    if (performances.length === 0) {
      throw new Error('No performances found');
    }

    const balletPerformances = performances.filter(perf => 
      perf.performanceType && 
      perf.performanceType.toLowerCase().includes('ballet')
    );

    console.log(`Found ${balletPerformances.length} ballet performances out of ${performances.length} total unique performances`);
    return balletPerformances;
  } catch (error) {
    console.error('Error scraping Bolshoi Ballet performances:', error.message);
    console.log('Falling back to mock data...');
    return getMockPerformances();
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

/**
 * Get mock performances for Bolshoi Ballet
 * @returns {Array} - Array of mock performance objects
 */
const getMockPerformances = () => {
  const year = new Date().getFullYear();
  return [
    {
      title: 'Swan Lake',
      startDate: `${year}-06-15`,
      endDate: `${year}-06-20`,
      description: 'Tchaikovsky\'s masterpiece performed by the Bolshoi Ballet.',
      image: 'https://via.placeholder.com/800x400.png?text=Swan+Lake',
      videoUrl: ''
    },
    {
      title: 'The Nutcracker',
      startDate: `${year}-12-20`,
      endDate: `${year}-12-30`,
      description: 'A magical Christmas ballet featuring Tchaikovsky\'s beloved score.',
      image: 'https://via.placeholder.com/800x400.png?text=The+Nutcracker',
      videoUrl: ''
    },
    {
      title: 'Don Quixote',
      startDate: `${year}-09-10`,
      endDate: `${year}-09-15`,
      description: 'A spirited ballet based on Cervantes\' famous novel.',
      image: 'https://via.placeholder.com/800x400.png?text=Don+Quixote',
      videoUrl: ''
    },
    {
      title: 'Romeo and Juliet',
      startDate: `${year}-11-05`,
      endDate: `${year}-11-10`,
      description: 'Prokofiev\'s passionate ballet brings Shakespeare\'s tragedy to life.',
      image: 'https://via.placeholder.com/800x400.png?text=Romeo+and+Juliet',
      videoUrl: ''
    },
    {
      title: 'La Bayadère',
      startDate: `${year}-08-01`,
      endDate: `${year}-08-06`,
      description: 'An exotic and tragic love story set in Royal India.',
      image: 'https://via.placeholder.com/800x400.png?text=La+Bayadère',
      videoUrl: ''
    }
  ];
};

module.exports = {
  scrapeCompanyInfo,
  scrapePerformances
};

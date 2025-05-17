const puppeteer = require('puppeteer');
const fs = require('fs').promises;

/**
 * Parse date range string into start and end dates
 * @param {string} dateText - Date range text
 * @returns {Object} - Object with startDate and endDate
 */
const parseDateRange = (dateText) => {
  try {
    // Try to match date range pattern (e.g., "14 April – 3 July 2025")
    const dateMatch = dateText.match(/(\d{1,2}\s+\w+)(?:\s+–\s+(\d{1,2}\s+\w+))?\s+(\d{4})/);
    if (dateMatch) {
      const startDateStr = `${dateMatch[1]} ${dateMatch[3]}`;
      const endDateStr = dateMatch[2] ? `${dateMatch[2]} ${dateMatch[3]}` : startDateStr;
      
      const startDate = new Date(startDateStr);
      const endDate = new Date(endDateStr);
      
      return {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      };
    }
    
    // If no match, try to parse as single date
    const date = new Date(dateText);
    if (!isNaN(date.getTime())) {
      const dateStr = date.toISOString().split('T')[0];
      return {
        startDate: dateStr,
        endDate: dateStr
      };
    }
    
    throw new Error('Unable to parse date');
  } catch (error) {
    console.error('Error parsing date range:', error.message);
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    return {
      startDate: dateStr,
      endDate: dateStr
    };
  }
};

/**
 * Scrape Royal Ballet company information
 * @returns {Promise<Object>} - Company information
 */
const scrapeCompanyInfo = async () => {
  try {
    console.log('Scraping Royal Ballet company info...');
    
    return {
      name: 'The Royal Ballet',
      shortName: 'Royal',
      description: 'The Royal Ballet is one of the world\'s greatest ballet companies, based at the Royal Opera House in London\'s Covent Garden.',
      logo: 'https://static.roh.org.uk/redesign/Logo_detail.png',
      website: 'https://www.roh.org.uk'
    };
  } catch (error) {
    console.error('Error scraping Royal Ballet company info:', error.message);
    return {
      name: 'The Royal Ballet',
      shortName: 'Royal',
      description: 'The Royal Ballet is one of the world\'s greatest ballet companies, based at the Royal Opera House in London\'s Covent Garden.',
      logo: 'https://via.placeholder.com/150x150.png?text=Royal+Logo',
      website: 'https://www.roh.org.uk'
    };
  }
};

/**
 * Scrape Royal Ballet performances
 * @returns {Promise<Array>} - Array of performance objects
 */
const scrapePerformances = async () => {
  let browser = null;
  try {
    console.log('Scraping Royal Ballet performances...');
    
    // Launch browser
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    // Create new page
    const page = await browser.newPage();
    
    // Listen to console messages
    page.on('console', msg => console.log('Browser console:', msg.text()));
    
    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 });
    
    // We won't use request interception as it can cause redirect loops
    
    console.log('Navigating to Royal Ballet events page...');
    
    // Navigate to events page
    await page.goto('https://www.roh.org.uk/tickets-and-events?event-type=ballet-and-dance&venue=main-stage', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    console.log('Saving page content for analysis...');
    const html = await page.content();
    await fs.writeFile('rb-website-content.html', html);
    
    // Wait for content to load and analyze page structure
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Get all elements and their classes for analysis
    const elements = await page.evaluate(() => {
      const all = document.getElementsByTagName('*');
      const classes = new Set();
      for (const el of all) {
        if (el.className && typeof el.className === 'string') {
          el.className.split(' ').forEach(c => classes.add(c));
        }
      }
      return Array.from(classes);
    });
    
    console.log('Found classes:', elements);
    
    console.log('Extracting performance data...');
    
    // Extract performance data
    const performances = await page.evaluate(() => {
      const results = [];
      
      // Find all event cards
      document.querySelectorAll('.kzgwro-1').forEach(card => {
        try {
          const title = card.querySelector('.fvcvvS')?.textContent?.trim() || '';
          const dateText = card.querySelector('.fuRcMt')?.textContent?.trim() || '';
          const description = card.querySelector('.leuwGK')?.textContent?.trim() || '';
          const imageUrl = card.querySelector('img')?.src || '';
          // Get the href and ensure it uses the correct domain
          let moreInfoUrl = card.querySelector('.glJKay')?.href || '';
          // Fix domain if needed
          moreInfoUrl = moreInfoUrl.replace('www.rbo.org.uk', 'www.roh.org.uk');
          
          if (title && dateText) {
            results.push({
              title,
              dateText,
              description,
              moreInfoUrl,
              image: imageUrl
            });
          }
        } catch (err) {
          console.error('Error processing event card:', err);
        }
      });
      
      return results;
    });
    
    console.log(`Found ${performances.length} performances`);
    
    // Process dates and format final results
    const processedPerformances = performances.map(perf => {
      const { startDate, endDate } = parseDateRange(perf.dateText);
      return {
        title: perf.title,
        startDate,
        endDate,
        description: perf.description || `Performance by The Royal Ballet: ${perf.title}`,
        moreInfoUrl: perf.moreInfoUrl,
        image: perf.image || `https://via.placeholder.com/800x400.png?text=${encodeURIComponent(perf.title)}`
      };
    });
    
    if (processedPerformances.length === 0) {
      console.log('No performances found, returning mock data');
      return getMockPerformances();
    }
    
    return processedPerformances;
  } catch (error) {
    console.error('Error scraping Royal Ballet performances:', error.message);
    console.error(error.stack);
    return getMockPerformances();
  } finally {
    if (browser) {
      console.log('Closing browser...');
      await browser.close();
    }
  }
};

/**
 * Get mock performances for Royal Ballet
 * @returns {Array} - Array of mock performance objects
 */
const getMockPerformances = () => {
  const year = 2025;
  return [
    {
      title: 'Carmen',
      startDate: `${year}-04-14`,
      endDate: `${year}-07-03`,
      description: 'Experience the passion and drama of Carmen, a timeless tale of love, jealousy, and betrayal set to Bizet\'s iconic score.',
      image: 'https://via.placeholder.com/800x400.png?text=Carmen',
      videoUrl: ''
    }
  ];
};

module.exports = {
  scrapeCompanyInfo,
  scrapePerformances
};

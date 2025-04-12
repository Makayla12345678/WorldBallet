const axios = require('axios');
const cheerio = require('cheerio');

async function exploreNBC2025_26() {
  try {
    console.log('Exploring NBC 2025-26 season page...');
    
    const url = 'https://national.ballet.ca/performances/202526-season';
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    console.log('Successfully connected to NBC 2025-26 season page');
    console.log('Status:', response.status);
    
    const $ = cheerio.load(response.data);
    const pageTitle = $('title').text();
    console.log('Page Title:', pageTitle);
    
    // Save the full HTML for inspection
    console.log('\nSaving full HTML to nbc-2025-26-website-full.html');
    require('fs').writeFileSync('nbc-2025-26-website-full.html', response.data);
    
    // Look for performance elements
    console.log('\nLooking for performance elements...');
    
    // Try different selectors that might contain performance information
    const selectors = [
      'section', 'article', '.performance', '.event', '.production', 
      '.show', '.ballet', '.season-production', '.production-item'
    ];
    
    for (const selector of selectors) {
      const elements = $(selector);
      console.log(`\nFound ${elements.length} elements with selector "${selector}"`);
      
      if (elements.length > 0) {
        elements.each((i, el) => {
          if (i < 5) { // Limit to first 5 to avoid too much output
            const $el = $(el);
            
            // Look for date text
            const dateText = $el.find('time, [class*="date"], [class*="Date"]').text().trim() || 
                            $el.text().match(/[A-Z][a-z]+ \d+\s*[-–]\s*[A-Z][a-z]+ \d+,\s*\d{4}/)?.[0] || '';
            
            // Look for title
            const title = $el.find('h1, h2, h3, h4').first().text().trim();
            
            if (dateText || title) {
              console.log(`\n--- Element ${i+1} (${selector}) ---`);
              if (title) console.log(`Title: ${title}`);
              if (dateText) console.log(`Date: ${dateText}`);
              
              // Get element HTML for inspection
              const html = $el.html().substring(0, 300) + '...';
              console.log(`HTML snippet: ${html}`);
            }
          }
        });
      }
    }
    
    // Look for heading elements that might contain performance titles
    console.log('\nLooking for potential performance titles in headings...');
    $('h1, h2, h3, h4, h5').each((i, el) => {
      const text = $(el).text().trim();
      if (text && text.length > 5 && text.length < 100) {
        console.log(`Potential performance title: "${text}" (${$(el).prop('tagName')})`);
      }
    });
    
    // Look for date patterns in the page
    console.log('\nLooking for date patterns...');
    const pageText = $('body').text();
    const datePattern = /[A-Z][a-z]+ \d+\s*[-–]\s*[A-Z][a-z]+ \d+,\s*\d{4}/g;
    const dates = pageText.match(datePattern) || [];
    
    console.log(`Found ${dates.length} date patterns:`);
    dates.forEach(date => console.log(`- ${date}`));
    
    console.log('\nExploration completed');
  } catch (error) {
    console.error('Error exploring NBC 2025-26 season page:', error.message);
  }
}

exploreNBC2025_26();

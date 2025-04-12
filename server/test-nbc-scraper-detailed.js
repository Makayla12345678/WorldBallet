const { scrapeCompanyInfo, scrapePerformances } = require('./scrapers/nbc');
const axios = require('axios');
const cheerio = require('cheerio');

async function testNBCScraper() {
  try {
    console.log('=== TESTING NBC SCRAPER ===');
    
    // Test company info scraper
    console.log('\n1. SCRAPING COMPANY INFO:');
    const companyInfo = await scrapeCompanyInfo();
    console.log('Company Name:', companyInfo.name);
    console.log('Description:', companyInfo.description.substring(0, 150) + '...');
    console.log('Website:', companyInfo.website);
    
    // Test performances scraper
    console.log('\n2. SCRAPING PERFORMANCES:');
    const performances = await scrapePerformances();
    console.log(`Found ${performances.length} performances:`);
    
    performances.forEach((p, index) => {
      console.log(`\n--- PERFORMANCE ${index + 1} ---`);
      console.log(`Title: ${p.title}`);
      console.log(`Dates: ${new Date(p.startDate).toLocaleDateString()} to ${new Date(p.endDate).toLocaleDateString()}`);
      console.log(`Description: ${p.description.substring(0, 150)}...`);
      console.log(`Image URL: ${p.image}`);
      if (p.videoUrl) {
        console.log(`Video URL: ${p.videoUrl}`);
      }
    });
    
    // Check if we're using mock data
    console.log('\n3. CHECKING IF USING MOCK DATA:');
    try {
      const response = await axios.get('https://national.ballet.ca/performances/202425-season', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      console.log('Successfully connected to NBC website');
      console.log('Status:', response.status);
      
      const $ = cheerio.load(response.data);
      const pageTitle = $('title').text();
      console.log('Page Title:', pageTitle);
      
      // Check if we can find any performances on the page using our updated approach
      let performanceCount = 0;
      
      // Look for sections with dates and titles
      $('section, article, div').each((i, el) => {
        // Look for date text in format like "May 30 - June 5, 2025"
        const dateText = $(el).find('time, [class*="date"], [class*="Date"]').text().trim() || 
                         $(el).children().first().text().match(/[A-Z][a-z]+ \d+\s*[-–]\s*[A-Z][a-z]+ \d+,\s*\d{4}/)?.[0] || '';
        
        if (dateText && dateText.match(/\d{4}/)) {
          const title = $(el).find('h1, h2, h3').first().text().trim();
          if (title) {
            performanceCount++;
            console.log(`Found performance: "${title}" (${dateText})`);
          }
        }
      });
      
      console.log('Performance elements found on page:', performanceCount);
      
      if (performanceCount === 0) {
        console.log('No performance elements found on the page. The scraper is likely using mock data.');
        
        // Try to find the correct selector by examining the page structure
        console.log('\n4. ATTEMPTING TO FIND CORRECT SELECTORS:');
        
        // Look for common container elements
        ['div.performance', '.performance', '.event', '.production', '.show', '.ballet'].forEach(selector => {
          const count = $(selector).length;
          if (count > 0) {
            console.log(`Found ${count} elements with selector: "${selector}"`);
          }
        });
        
        // Look for elements with "performance" in their class or id
        $('*[class*="performance"], *[id*="performance"]').each((i, el) => {
          console.log(`Found element with performance in class/id: ${$(el).prop('tagName')} (class: ${$(el).attr('class')})`);
        });
        
        // Look for heading elements that might contain performance titles
        $('h1, h2, h3, h4, h5').each((i, el) => {
          const text = $(el).text().trim();
          if (text && text.length > 5 && text.length < 100) {
            console.log(`Potential performance title: "${text}" (${$(el).prop('tagName')})`);
          }
        });
      } else {
        console.log('Performance elements found. The scraper might be working correctly.');
      }
    } catch (error) {
      console.error('Error connecting to NBC website:', error.message);
      console.log('The scraper is using mock data because it cannot access the real website.');
    }
    
    console.log('\n=== TEST COMPLETED ===');
  } catch (error) {
    console.error('Error testing NBC scraper:', error);
  }
}

testNBCScraper();

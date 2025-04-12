const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Explore the National Ballet of Canada website to identify the correct URLs and selectors
 */
async function exploreNBCWebsite() {
  try {
    console.log('=== EXPLORING NBC WEBSITE STRUCTURE ===');
    
    // Step 1: Explore the main page
    console.log('\n1. EXPLORING MAIN PAGE:');
    const mainPageResponse = await axios.get('https://national.ballet.ca', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    console.log('Main page status:', mainPageResponse.status);
    
    let $ = cheerio.load(mainPageResponse.data);
    console.log('Main page title:', $('title').text());
    
    // Look for performance links
    console.log('\nLooking for performance links on main page:');
    $('a').each((i, el) => {
      const href = $(el).attr('href') || '';
      const text = $(el).text().trim();
      
      if (href.includes('performance') || href.includes('production') || 
          text.includes('Performance') || text.includes('production')) {
        console.log(`- Link: ${text} (${href})`);
      }
    });
    
    // Step 2: Explore the performances page
    console.log('\n2. EXPLORING PERFORMANCES PAGE:');
    try {
      const performancesResponse = await axios.get('https://national.ballet.ca/performances', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      console.log('Performances page status:', performancesResponse.status);
      
      $ = cheerio.load(performancesResponse.data);
      console.log('Performances page title:', $('title').text());
      
      // Look for season links
      console.log('\nLooking for season links:');
      $('a').each((i, el) => {
        const href = $(el).attr('href') || '';
        const text = $(el).text().trim();
        
        if (href.includes('season') || text.includes('Season')) {
          console.log(`- Season link: ${text} (${href})`);
        }
      });
    } catch (error) {
      console.log('Error accessing performances page:', error.message);
      console.log('Trying alternative URLs...');
    }
    
    // Step 3: Explore the 2024/25 season page
    console.log('\n3. EXPLORING 2024/25 SEASON PAGE:');
    try {
      const seasonResponse = await axios.get('https://national.ballet.ca/performances/202425-season', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      console.log('2024/25 Season page status:', seasonResponse.status);
      
      $ = cheerio.load(seasonResponse.data);
      console.log('2024/25 Season page title:', $('title').text());
      
      // Look for performance links
      console.log('\nLooking for performance links on 2024/25 season page:');
      $('a').each((i, el) => {
        const href = $(el).attr('href') || '';
        const text = $(el).text().trim();
        
        if (href.includes('production') || text.length > 5 && text.length < 50) {
          console.log(`- Performance link: ${text} (${href})`);
        }
      });
      
      // Analyze page structure
      console.log('\nAnalyzing page structure:');
      
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
    } catch (error) {
      console.log('Error accessing 2024/25 season page:', error.message);
    }
    
    // Step 4: Explore a specific performance page
    console.log('\n4. EXPLORING A SPECIFIC PERFORMANCE PAGE:');
    try {
      const performanceResponse = await axios.get('https://national.ballet.ca/productions/adieu', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      console.log('Performance page status:', performanceResponse.status);
      
      $ = cheerio.load(performanceResponse.data);
      console.log('Performance page title:', $('title').text());
      
      // Extract performance details
      console.log('\nExtracting performance details:');
      
      // Title
      const title = $('h1').first().text().trim();
      console.log('Title:', title);
      
      // Dates
      const dates = $('*:contains("Running Time")').closest('div').next().find('*:contains("Dates")').next().text().trim();
      console.log('Dates:', dates);
      
      // Description
      const description = $('p').filter((i, el) => {
        const text = $(el).text().trim();
        return text.length > 100;
      }).first().text().trim();
      console.log('Description:', description ? description.substring(0, 150) + '...' : 'Not found');
      
      // Image
      const image = $('img').filter((i, el) => {
        const src = $(el).attr('src') || '';
        return src.includes('production') || src.includes('performance');
      }).first().attr('src');
      console.log('Image URL:', image || 'Not found');
      
      // Analyze page structure
      console.log('\nAnalyzing performance page structure:');
      
      // Look for date elements
      $('*:contains("Dates")').each((i, el) => {
        console.log(`Date element: ${$(el).prop('tagName')} (text: ${$(el).text().trim()})`);
      });
      
      // Look for description elements
      $('p').each((i, el) => {
        const text = $(el).text().trim();
        if (text.length > 50) {
          console.log(`Description element: ${$(el).prop('tagName')} (text: ${text.substring(0, 50)}...)`);
        }
      });
    } catch (error) {
      console.log('Error accessing performance page:', error.message);
    }
    
    console.log('\n=== EXPLORATION COMPLETED ===');
  } catch (error) {
    console.error('Error exploring NBC website:', error);
  }
}

exploreNBCWebsite();

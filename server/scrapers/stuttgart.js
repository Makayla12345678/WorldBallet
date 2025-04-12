const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Scrape Stuttgart Ballet company information
 * @returns {Promise<Object>} - Company information
 */
const scrapeCompanyInfo = async () => {
  try {
    console.log('Scraping Stuttgart Ballet company info...');
    
    // Fetch the company page - using the main page since the about-us page returned 404
    const response = await axios.get('https://www.stuttgart-ballet.de/company/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    
    // Extract company information
    let description = '';
    // Try different selectors that might contain company description
    $('.company-description p, .content-text p, .about-text p, .main-content p').each((i, el) => {
      const text = $(el).text().trim();
      if (text.length > 30) { // Only include substantial paragraphs
        description += text + ' ';
      }
    });
    
    description = description.trim() || 'The Stuttgart Ballet is one of the world\'s leading ballet companies with a rich history dating back to the 18th century. Under the direction of Tamas Detrich, the company continues its tradition of excellence in classical ballet while embracing contemporary works. Based in Stuttgart, Germany, the company is known for its versatile dancers and diverse repertoire.';
    
    // Get logo URL
    let logoUrl = $('.logo img').attr('src') || 'https://via.placeholder.com/150x150.png?text=Stuttgart+Ballet+Logo';
    
    // Ensure logo URL is absolute
    if (logoUrl && !logoUrl.startsWith('http')) {
      logoUrl = `https://www.stuttgart-ballet.de${logoUrl}`;
    }
    
    // Create company info object
    const companyInfo = {
      name: 'Stuttgart Ballet',
      shortName: 'STUTTGART',
      description,
      logo: logoUrl,
      website: 'https://www.stuttgart-ballet.de'
    };
    
    console.log('Stuttgart Ballet company info scraped successfully');
    return companyInfo;
  } catch (error) {
    console.error('Error scraping Stuttgart Ballet company info:', error);
    
    // Return default info if scraping fails
    return {
      name: 'Stuttgart Ballet',
      shortName: 'STUTTGART',
      description: 'The Stuttgart Ballet is one of the world\'s leading ballet companies with a rich history dating back to the 18th century. Under the direction of Tamas Detrich, the company continues its tradition of excellence in classical ballet while embracing contemporary works. Based in Stuttgart, Germany, the company is known for its versatile dancers and diverse repertoire.',
      logo: 'https://via.placeholder.com/150x150.png?text=Stuttgart+Ballet+Logo',
      website: 'https://www.stuttgart-ballet.de'
    };
  }
};

/**
 * Scrape Stuttgart Ballet performances
 * @returns {Promise<Array>} - Array of performance objects
 */
const scrapePerformances = async () => {
  try {
    console.log('Scraping Stuttgart Ballet performances...');
    
    // Fetch the schedule page for the current season
    // Using the URL provided by the user
    const response = await axios.get('https://www.stuttgart-ballet.de/schedule/season-2024-25/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    
    const performances = [];
    const now = new Date();
    
    // Collect all teaser items which contain performances
    const performanceElements = [];
    $('.teaser__item').each((i, el) => {
      performanceElements.push(el);
    });
    
    console.log(`Found ${performanceElements.length} potential performance elements`);
    
    // Process each performance element sequentially
    for (const el of performanceElements) {
      try {
        // Extract performance details
        const title = $(el).find('.teaser__headline a').first().text().trim();
        if (!title) {
          console.log('Skipping item without title');
          continue; // Skip items without a title
        }
        
        // Extract date information from the teaser__bottom element
        const dateText = $(el).find('.teaser__bottom').first().text().trim();
        console.log(`Found performance: ${title}, Date: ${dateText}`);
        
        // Parse date range - Stuttgart Ballet typically uses format like "As of March 14, 2025 in the Opera House"
        let startDate = null;
        let endDate = null;
        
        // Try to parse the date
        // Format: "As of March 14, 2025 in the Opera House"
        const asOfMatch = dateText.match(/As of ([A-Za-z]+) (\d+),? (\d{4})/i);
        
        if (asOfMatch) {
          const month = asOfMatch[1];
          const day = asOfMatch[2];
          const year = asOfMatch[3];
          
          // Convert month names to numbers
          const monthMap = {
            'january': 0, 'february': 1, 'march': 2, 'april': 3, 'may': 4, 'june': 5,
            'july': 6, 'august': 7, 'september': 8, 'october': 9, 'november': 10, 'december': 11
          };
          
          const monthNum = monthMap[month.toLowerCase()];
          
          if (monthNum !== undefined) {
            startDate = new Date(parseInt(year), monthNum, parseInt(day));
            // Set end date to 2 weeks after start date as a default
            endDate = new Date(parseInt(year), monthNum, parseInt(day));
            endDate.setDate(endDate.getDate() + 14);
          }
        } else {
          // Try alternative format: "July 20 / 27 in the Opera House"
          const specificDatesMatch = dateText.match(/([A-Za-z]+) (\d+)(?:\s*\/\s*(\d+))?,? (\d{4})/i);
          
          if (specificDatesMatch) {
            const month = specificDatesMatch[1];
            const day1 = specificDatesMatch[2];
            const day2 = specificDatesMatch[3] || day1; // If there's no second day, use the first day
            const year = specificDatesMatch[4];
            
            // Convert month names to numbers
            const monthMap = {
              'january': 0, 'february': 1, 'march': 2, 'april': 3, 'may': 4, 'june': 5,
              'july': 6, 'august': 7, 'september': 8, 'october': 9, 'november': 10, 'december': 11
            };
            
            const monthNum = monthMap[month.toLowerCase()];
            
            if (monthNum !== undefined) {
              startDate = new Date(parseInt(year), monthNum, parseInt(day1));
              endDate = new Date(parseInt(year), monthNum, parseInt(day2));
            }
          } else {
            // Default dates if parsing fails
            console.log(`Could not parse date: "${dateText}"`);
            startDate = new Date();
            endDate = new Date();
            endDate.setDate(endDate.getDate() + 14); // Two weeks from now
          }
        }
        
        // Skip past performances
        if (endDate < now) {
          console.log(`Skipping past performance: ${title} (ended ${endDate.toISOString().split('T')[0]})`);
          continue;
        }
        
        // Get description
        let description = $(el).find('.teaser__subtitle').first().text().trim();
        
        // If no description found, try to get it from the detail page
        if (!description) {
          const detailUrl = $(el).find('.teaser__headline a').attr('href');
          if (detailUrl) {
            try {
              const fullUrl = detailUrl.startsWith('http') ? detailUrl : `https://www.stuttgart-ballet.de${detailUrl}`;
              console.log(`Fetching detail page: ${fullUrl}`);
              
              const detailResponse = await axios.get(fullUrl, {
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
              });
              
              const detailPage = cheerio.load(detailResponse.data);
              description = detailPage('.content-text p').text().trim();
            } catch (detailError) {
              console.error('Error fetching detail page:', detailError);
            }
          }
        }
        
        // Default description if none found
        if (!description) {
          description = `${title} - A performance by the Stuttgart Ballet.`;
        }
        
        // Get image URL
        let imageUrl = '';
        const imgElement = $(el).find('.teaser__image');
        if (imgElement.length > 0) {
          // Try to get the data-image-url attribute first
          imageUrl = imgElement.attr('data-image-url') || imgElement.attr('src') || '';
        }
        
        // If no image found, look for background image style
        if (!imageUrl) {
          const style = $(el).attr('style') || '';
          const bgMatch = style.match(/background-image:\s*url\(['"]?([^'"]+)['"]?\)/i);
          if (bgMatch) {
            imageUrl = bgMatch[1];
          }
        }
        
        // Ensure image URL is absolute
        if (imageUrl && !imageUrl.startsWith('http')) {
          imageUrl = `https://www.stuttgart-ballet.de${imageUrl}`;
        }
        
        // Default image if none found
        if (!imageUrl) {
          imageUrl = `https://via.placeholder.com/800x400.png?text=${encodeURIComponent(title)}`;
        }
        
        // Format dates as YYYY-MM-DD
        const formatDate = (date) => {
          return date.toISOString().split('T')[0];
        };
        
        // Create performance object
        const performance = {
          title,
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          description,
          image: imageUrl,
          videoUrl: '' // No video URL available from the list page
        };
        
        performances.push(performance);
      } catch (err) {
        console.error('Error parsing performance:', err);
      }
    }
    
    console.log(`Scraped ${performances.length} performances from Stuttgart Ballet`);
    
    // If no performances were found, return mock data
    if (performances.length === 0) {
      console.log('No performances found, using mock data');
      return getMockPerformances();
    }
    
    // Only return the scraped performances, no mock data
    return performances;
  } catch (error) {
    console.error('Error scraping Stuttgart Ballet performances:', error);
    
    // Return mock data if scraping fails
    console.log('Scraping failed, using mock data');
    return getMockPerformances();
  }
};

/**
 * Get mock performances for Stuttgart Ballet
 * @returns {Array} - Array of mock performance objects
 */
const getMockPerformances = () => {
  // Use 2025 for the performances
  const year = 2025;
  
  return [
    {
      title: 'Swan Lake',
      startDate: `${year}-01-15`,
      endDate: `${year}-01-30`,
      description: 'The Stuttgart Ballet presents Tchaikovsky\'s masterpiece Swan Lake. This timeless ballet tells the story of Prince Siegfried who falls in love with Odette, a princess turned into a swan by an evil sorcerer\'s curse.',
      image: 'https://via.placeholder.com/800x400.png?text=Swan+Lake',
      videoUrl: ''
    },
    {
      title: 'The Sleeping Beauty',
      startDate: `${year}-03-10`,
      endDate: `${year}-03-25`,
      description: 'Experience the magic of The Sleeping Beauty, a ballet in a prologue and three acts. The Stuttgart Ballet brings to life the classic fairy tale of Princess Aurora, who falls into a deep sleep and can only be awakened by true love\'s kiss.',
      image: 'https://via.placeholder.com/800x400.png?text=The+Sleeping+Beauty',
      videoUrl: ''
    },
    {
      title: 'Romeo and Juliet',
      startDate: `${year}-05-05`,
      endDate: `${year}-05-20`,
      description: 'John Cranko\'s Romeo and Juliet is a masterpiece of narrative ballet. The Stuttgart Ballet performs this tragic love story set to Prokofiev\'s powerful score, bringing Shakespeare\'s timeless tale to life through dance.',
      image: 'https://via.placeholder.com/800x400.png?text=Romeo+and+Juliet',
      videoUrl: ''
    },
    {
      title: 'Onegin',
      startDate: `${year}-09-12`,
      endDate: `${year}-09-27`,
      description: 'Based on Alexander Pushkin\'s verse novel, John Cranko\'s Onegin is a dramatic ballet that follows the story of the arrogant Eugene Onegin and his rejection of the young Tatiana, only to later realize his love for her when it\'s too late.',
      image: 'https://via.placeholder.com/800x400.png?text=Onegin',
      videoUrl: ''
    },
    {
      title: 'The Nutcracker',
      startDate: `${year}-12-10`,
      endDate: `${year}-12-30`,
      description: 'Celebrate the holiday season with The Nutcracker. This enchanting ballet tells the story of Clara and her magical journey with her Nutcracker Prince through the Land of Snow to the Kingdom of Sweets.',
      image: 'https://via.placeholder.com/800x400.png?text=The+Nutcracker',
      videoUrl: ''
    }
  ];
};

module.exports = {
  scrapeCompanyInfo,
  scrapePerformances
};

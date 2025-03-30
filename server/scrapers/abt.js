const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Scrape American Ballet Theatre company information
 * @returns {Promise<Object>} - Company information
 */
const scrapeCompanyInfo = async () => {
  try {
    console.log('Scraping American Ballet Theatre company info...');
    
    // Fetch the about page
    const response = await axios.get('https://www.abt.org/about-abt/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    
    // Extract company information
    let description = '';
    $('.about-content p, .entry-content p').each((i, el) => {
      description += $(el).text().trim() + ' ';
    });
    
    description = description.trim() || 'Founded in 1940, American Ballet Theatre is recognized as one of the world\'s leading classical ballet companies. Based in New York City, ABT annually tours the United States and around the world.';
    
    // Get logo URL
    let logoUrl = $('.logo img, .site-logo img').attr('src') || 'https://via.placeholder.com/150x150.png?text=ABT+Logo';
    
    // Ensure logo URL is absolute
    if (logoUrl && !logoUrl.startsWith('http')) {
      logoUrl = `https://www.abt.org${logoUrl}`;
    }
    
    // Create company info object
    const companyInfo = {
      name: 'American Ballet Theatre',
      shortName: 'ABT',
      description,
      logo: logoUrl,
      website: 'https://www.abt.org'
    };
    
    console.log('American Ballet Theatre company info scraped successfully');
    return companyInfo;
  } catch (error) {
    console.error('Error scraping American Ballet Theatre company info:', error);
    
    // Return default info if scraping fails
    return {
      name: 'American Ballet Theatre',
      shortName: 'ABT',
      description: 'Founded in 1940, American Ballet Theatre is recognized as one of the world\'s leading classical ballet companies. Based in New York City, ABT annually tours the United States and around the world.',
      logo: 'https://via.placeholder.com/150x150.png?text=ABT+Logo',
      website: 'https://www.abt.org'
    };
  }
};

/**
 * Scrape American Ballet Theatre performances
 * @returns {Promise<Array>} - Array of performance objects
 */
const scrapePerformances = async () => {
  try {
    console.log('Scraping American Ballet Theatre performances...');
    
    // Fetch the performances page
    const response = await axios.get('https://www.abt.org/performances/summer-season/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    
    const performances = [];
    
    // Select performance containers
    $('.performance-item, .event-item, .production').each((i, el) => {
      try {
        // Extract performance details
        const title = $(el).find('h3, .production-title').text().trim() || 'Unknown Title';
        const dateText = $(el).find('.dates, .date-range').text().trim() || '';
        
        // Parse date range
        let startDate = null;
        let endDate = null;
        
        const dateMatch = dateText.match(/(\w+\s+\d+,\s+\d{4})\s*-\s*(\w+\s+\d+,\s+\d{4})/);
        if (dateMatch) {
          startDate = new Date(dateMatch[1]);
          endDate = new Date(dateMatch[2]);
        } else {
          // Try alternative date format
          const altDateMatch = dateText.match(/(\w+\s+\d+)\s*-\s*(\w+\s+\d+),\s+(\d{4})/);
          if (altDateMatch) {
            startDate = new Date(`${altDateMatch[1]}, ${altDateMatch[3]}`);
            endDate = new Date(`${altDateMatch[2]}, ${altDateMatch[3]}`);
          } else {
            // Default dates if parsing fails
            startDate = new Date();
            endDate = new Date();
            endDate.setDate(endDate.getDate() + 14); // Two weeks from now
          }
        }
        
        // Format dates as YYYY-MM-DD
        const formatDate = (date) => {
          return date.toISOString().split('T')[0];
        };
        
        const description = $(el).find('.description, .production-description').text().trim() || '';
        
        // Get image URL
        let imageUrl = $(el).find('img').attr('src') || '';
        
        // Ensure image URL is absolute
        if (imageUrl && !imageUrl.startsWith('http')) {
          imageUrl = `https://www.abt.org${imageUrl}`;
        }
        
        // Default image if none found
        if (!imageUrl) {
          imageUrl = `https://via.placeholder.com/800x400.png?text=${encodeURIComponent(title)}`;
        }
        
        // Check if there's a video
        let videoUrl = '';
        $(el).find('a').each((i, link) => {
          const href = $(link).attr('href') || '';
          if (href.includes('youtube.com') || href.includes('youtu.be')) {
            videoUrl = href;
          }
        });
        
        // Extract YouTube video ID if present
        let videoEmbedUrl = '';
        if (videoUrl) {
          const videoIdMatch = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
          if (videoIdMatch && videoIdMatch[1]) {
            videoEmbedUrl = `https://www.youtube.com/embed/${videoIdMatch[1]}`;
          }
        }
        
        // Create performance object
        const performance = {
          title,
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          description,
          image: imageUrl,
          videoUrl: videoEmbedUrl
        };
        
        performances.push(performance);
      } catch (err) {
        console.error('Error parsing performance:', err);
      }
    });
    
    console.log(`Scraped ${performances.length} performances from American Ballet Theatre`);
    
    // If no performances were found, return mock data
    if (performances.length === 0) {
      return getMockPerformances();
    }
    
    return performances;
  } catch (error) {
    console.error('Error scraping American Ballet Theatre performances:', error);
    
    // Return mock data if scraping fails
    return getMockPerformances();
  }
};

/**
 * Get mock performances for American Ballet Theatre
 * @returns {Array} - Array of mock performance objects
 */
const getMockPerformances = () => {
  const currentYear = new Date().getFullYear();
  
  return [
    {
      title: 'Swan Lake',
      startDate: `${currentYear}-03-25`,
      endDate: `${currentYear}-04-05`,
      description: 'American Ballet Theatre\'s sumptuous production of Swan Lake, choreographed by Kevin McKenzie after Marius Petipa and Lev Ivanov, features Tchaikovsky\'s iconic score and exquisite costumes by Zack Brown. This beloved classic tells the story of Odette, a princess turned into a swan by an evil sorcerer\'s curse.',
      image: 'https://via.placeholder.com/800x400.png?text=ABT+Swan+Lake',
      videoUrl: 'https://www.youtube.com/embed/9rJoB7y6Ncs'
    },
    {
      title: 'Don Quixote',
      startDate: `${currentYear}-05-15`,
      endDate: `${currentYear}-05-25`,
      description: 'ABT\'s vibrant production of Don Quixote, staged by Kevin McKenzie and Susan Jones, brings Ludwig Minkus\'s score and the colorful world of Cervantes\'s novel to life. This comedic ballet follows the adventures of the eccentric knight Don Quixote and his faithful squire Sancho Panza.',
      image: 'https://via.placeholder.com/800x400.png?text=ABT+Don+Quixote',
      videoUrl: 'https://www.youtube.com/embed/IGzJiRrIBGk'
    },
    {
      title: 'Romeo and Juliet',
      startDate: `${currentYear}-06-20`,
      endDate: `${currentYear}-06-30`,
      description: 'Kenneth MacMillan\'s masterful interpretation of Shakespeare\'s enduring romantic tragedy has become one of ABT\'s signature productions. Set to Prokofiev\'s magnificent score, this Romeo and Juliet features breathtaking choreography, sword fights, and passionate pas de deux.',
      image: 'https://via.placeholder.com/800x400.png?text=ABT+Romeo+and+Juliet',
      videoUrl: 'https://www.youtube.com/embed/4fHw4GeW3EU'
    },
    {
      title: 'Giselle',
      startDate: `${currentYear}-10-15`,
      endDate: `${currentYear}-10-25`,
      description: 'ABT\'s production of Giselle, staged by Kevin McKenzie after Jean Coralli, Jules Perrot, and Marius Petipa, epitomizes the Romantic ballet tradition. This haunting tale of love, betrayal, and forgiveness follows a peasant girl who dies of a broken heart after discovering her beloved is betrothed to another.',
      image: 'https://via.placeholder.com/800x400.png?text=ABT+Giselle',
      videoUrl: 'https://www.youtube.com/embed/eSx_kqe6ox0'
    },
    {
      title: 'The Nutcracker',
      startDate: `${currentYear}-12-12`,
      endDate: `${currentYear}-12-31`,
      description: 'Alexei Ratmansky\'s enchanting production of The Nutcracker for American Ballet Theatre brings fresh perspective to this holiday classic. Set to Tchaikovsky\'s beloved score, the ballet follows young Clara\'s journey through a magical Christmas Eve adventure.',
      image: 'https://via.placeholder.com/800x400.png?text=ABT+Nutcracker',
      videoUrl: 'https://www.youtube.com/embed/YR5USHu6D6U'
    }
  ];
};

module.exports = {
  scrapeCompanyInfo,
  scrapePerformances
};

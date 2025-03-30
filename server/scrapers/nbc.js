const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Scrape National Ballet of Canada company information
 * @returns {Promise<Object>} - Company information
 */
const scrapeCompanyInfo = async () => {
  try {
    console.log('Scraping National Ballet of Canada company info...');
    
    // Fetch the about page
    const response = await axios.get('https://national.ballet.ca/our-history/about-the-national-ballet-of-canada', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    
    // Extract company information
    let description = '';
    $('.entry-content p').each((i, el) => {
      description += $(el).text().trim() + ' ';
    });
    
    description = description.trim() || 'Founded in 1951, the National Ballet of Canada is one of the premier dance companies in North America. Based in Toronto, the company performs a traditional and contemporary repertoire of the highest caliber.';
    
    // Get logo URL
    let logoUrl = $('.site-logo img').attr('src') || 'https://via.placeholder.com/150x150.png?text=NBC+Logo';
    
    // Ensure logo URL is absolute
    if (logoUrl && !logoUrl.startsWith('http')) {
      logoUrl = `https://national.ballet.ca${logoUrl}`;
    }
    
    // Create company info object
    const companyInfo = {
      name: 'National Ballet of Canada',
      shortName: 'NBC',
      description,
      logo: logoUrl,
      website: 'https://national.ballet.ca'
    };
    
    console.log('National Ballet of Canada company info scraped successfully');
    return companyInfo;
  } catch (error) {
    console.error('Error scraping National Ballet of Canada company info:', error);
    
    // Return default info if scraping fails
    return {
      name: 'National Ballet of Canada',
      shortName: 'NBC',
      description: 'Founded in 1951, the National Ballet of Canada is one of the premier dance companies in North America. Based in Toronto, the company performs a traditional and contemporary repertoire of the highest caliber.',
      logo: 'https://via.placeholder.com/150x150.png?text=NBC+Logo',
      website: 'https://national.ballet.ca'
    };
  }
};

/**
 * Scrape National Ballet of Canada performances
 * @returns {Promise<Array>} - Array of performance objects
 */
const scrapePerformances = async () => {
  try {
    console.log('Scraping National Ballet of Canada performances...');
    
    // Fetch the performances page
    const response = await axios.get('https://national.ballet.ca/performances', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    
    const performances = [];
    
    // Select performance containers
    $('.performance-card, .performance-item').each((i, el) => {
      try {
        // Extract performance details
        const title = $(el).find('h2, h3').text().trim() || 'Unknown Title';
        const dateText = $(el).find('.dates, .date-range').text().trim() || '';
        
        // Parse date range
        let startDate = null;
        let endDate = null;
        
        const dateMatch = dateText.match(/(\w+\s+\d+,\s+\d{4})\s*-\s*(\w+\s+\d+,\s+\d{4})/);
        if (dateMatch) {
          startDate = new Date(dateMatch[1]);
          endDate = new Date(dateMatch[2]);
        } else {
          // Default dates if parsing fails
          startDate = new Date();
          endDate = new Date();
          endDate.setDate(endDate.getDate() + 14); // Two weeks from now
        }
        
        // Format dates as YYYY-MM-DD
        const formatDate = (date) => {
          return date.toISOString().split('T')[0];
        };
        
        const description = $(el).find('.description').text().trim() || '';
        
        // Get image URL
        let imageUrl = $(el).find('img').attr('src') || '';
        
        // Ensure image URL is absolute
        if (imageUrl && !imageUrl.startsWith('http')) {
          imageUrl = `https://national.ballet.ca${imageUrl}`;
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
    
    console.log(`Scraped ${performances.length} performances from National Ballet of Canada`);
    
    // If no performances were found, return mock data
    if (performances.length === 0) {
      return getMockPerformances();
    }
    
    return performances;
  } catch (error) {
    console.error('Error scraping National Ballet of Canada performances:', error);
    
    // Return mock data if scraping fails
    return getMockPerformances();
  }
};

/**
 * Get mock performances for National Ballet of Canada
 * @returns {Array} - Array of mock performance objects
 */
const getMockPerformances = () => {
  const currentYear = new Date().getFullYear();
  
  return [
    {
      title: 'Romeo and Juliet',
      startDate: `${currentYear}-03-20`,
      endDate: `${currentYear}-04-10`,
      description: 'Alexei Ratmansky\'s passionate reimagining of Shakespeare\'s tragic love story set to Prokofiev\'s powerful score. This innovative production brings fresh perspective to the classic tale of star-crossed lovers, featuring breathtaking choreography that highlights the technical brilliance of the company\'s dancers.',
      image: 'https://via.placeholder.com/800x400.png?text=Romeo+and+Juliet',
      videoUrl: 'https://www.youtube.com/embed/4fHw4GeW3EU'
    },
    {
      title: 'Spring Mixed Program',
      startDate: `${currentYear}-05-05`,
      endDate: `${currentYear}-05-15`,
      description: 'A vibrant collection of contemporary works featuring Crystal Pite\'s \'Angels\' Atlas\' and Balanchine\'s \'Serenade\'. This dynamic program showcases the versatility of the company with three distinct pieces that span the range of ballet today.',
      image: 'https://via.placeholder.com/800x400.png?text=Spring+Mixed+Program',
      videoUrl: 'https://www.youtube.com/embed/Urz4v1JVXZQ'
    },
    {
      title: 'Giselle',
      startDate: `${currentYear}-06-10`,
      endDate: `${currentYear}-06-20`,
      description: 'The romantic classic of love, betrayal, and forgiveness with ethereal choreography and Adolphe Adam\'s memorable score. One of the oldest continually performed ballets, Giselle tells the story of a peasant girl who dies of a broken heart after discovering her lover is betrothed to another.',
      image: 'https://via.placeholder.com/800x400.png?text=Giselle',
      videoUrl: 'https://www.youtube.com/embed/eSx_kqe6ox0'
    },
    {
      title: 'The Nutcracker',
      startDate: `${currentYear}-12-10`,
      endDate: `${currentYear}-12-31`,
      description: 'The beloved holiday classic returns with Tchaikovsky\'s magical score and James Kudelka\'s enchanting choreography. This distinctly Canadian production follows Misha and Marie on a magical Christmas Eve adventure.',
      image: 'https://via.placeholder.com/800x400.png?text=The+Nutcracker',
      videoUrl: 'https://www.youtube.com/embed/YR5USHu6D6U'
    },
    {
      title: 'Swan Lake',
      startDate: `${currentYear + 1}-03-05`,
      endDate: `${currentYear + 1}-03-20`,
      description: 'The timeless tale of love and deception featuring Tchaikovsky\'s iconic score and Karen Kain\'s breathtaking choreography. This production honors the classical legacy of Swan Lake while incorporating fresh perspectives.',
      image: 'https://via.placeholder.com/800x400.png?text=Swan+Lake',
      videoUrl: 'https://www.youtube.com/embed/9rJoB7y6Ncs'
    }
  ];
};

module.exports = {
  scrapeCompanyInfo,
  scrapePerformances
};

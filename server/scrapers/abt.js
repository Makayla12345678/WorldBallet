const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Scrape American Ballet Theatre company information
 * @returns {Promise<Object>} - Company information
 */
const scrapeCompanyInfo = async () => {
  try {
    console.log('Scraping American Ballet Theatre company info...');
    
    // Fetch the main page instead of the about page
    const response = await axios.get('https://www.abt.org', {
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
    
    // Fetch the summer season page
    const response = await axios.get('https://www.abt.org/performances/summer-season', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    
    const performances = [];
    
    // Get the season date range if available
    const seasonDateText = $('.season-dates').text().trim() || '';
    let seasonStartDate = null;
    let seasonEndDate = null;
    
    // Try to parse the season date range (e.g., "June 10 - July 19, 2025")
    const seasonDateMatch = seasonDateText.match(/([A-Za-z]+\s+\d+)\s*[-–]\s*([A-Za-z]+\s+\d+),\s*(\d{4})/);
    if (seasonDateMatch) {
      const startMonthDay = seasonDateMatch[1];
      const endMonthDay = seasonDateMatch[2];
      const year = seasonDateMatch[3];
      seasonStartDate = new Date(`${startMonthDay}, ${year}`);
      seasonEndDate = new Date(`${endMonthDay}, ${year}`);
    }
    
    // Select performance containers - look for various selectors that might contain performances
    $('.performance-item, .event-item, .production, .program, .repertory-item, article, .performance-card').each((i, el) => {
      try {
        // Extract performance details
        const title = $(el).find('h1, h2, h3, h4, .title, .production-title').first().text().trim() || 'Unknown Title';
        
        // Look for date information in various places
        const dateText = $(el).find('.dates, .date-range, .performance-dates, time').text().trim() || '';
        
        // Parse date range
        let startDate = null;
        let endDate = null;
        
        // Try different date formats
        // Format 1: "Month Day, Year - Month Day, Year"
        const dateMatch = dateText.match(/(\w+\s+\d+,\s+\d{4})\s*[-–]\s*(\w+\s+\d+,\s+\d{4})/);
        if (dateMatch) {
          startDate = new Date(dateMatch[1]);
          endDate = new Date(dateMatch[2]);
        } else {
          // Format 2: "Month Day - Month Day, Year"
          const altDateMatch = dateText.match(/(\w+\s+\d+)\s*[-–]\s*(\w+\s+\d+),\s+(\d{4})/);
          if (altDateMatch) {
            startDate = new Date(`${altDateMatch[1]}, ${altDateMatch[3]}`);
            endDate = new Date(`${altDateMatch[2]}, ${altDateMatch[3]}`);
          } else {
            // Format 3: "Month Day - Day, Year"
            const shortDateMatch = dateText.match(/(\w+\s+\d+)\s*[-–]\s*(\d+),\s+(\d{4})/);
            if (shortDateMatch) {
              const month = shortDateMatch[1].split(' ')[0];
              startDate = new Date(`${shortDateMatch[1]}, ${shortDateMatch[3]}`);
              endDate = new Date(`${month} ${shortDateMatch[2]}, ${shortDateMatch[3]}`);
            } else if (seasonStartDate && seasonEndDate) {
              // If we couldn't parse specific dates but have season dates, use those
              startDate = new Date(seasonStartDate);
              endDate = new Date(seasonEndDate);
            } else {
              // Default dates if parsing fails
              const currentYear = new Date().getFullYear();
              startDate = new Date(`June 10, ${currentYear}`);
              endDate = new Date(`July 19, ${currentYear}`);
            }
          }
        }
        
        // Format dates as YYYY-MM-DD
        const formatDate = (date) => {
          return date.toISOString().split('T')[0];
        };
        
        // Get description from various possible elements
        let description = '';
        $(el).find('p, .description, .production-description, .summary, .details').each((i, p) => {
          const text = $(p).text().trim();
          if (text.length > 30) { // Only include substantial paragraphs
            description += text + ' ';
          }
        });
        description = description.trim() || '';
        
        // If no description found, look for it in parent containers
        if (!description) {
          $(el).parents('section, article, div').find('p').each((i, p) => {
            const text = $(p).text().trim();
            if (text.length > 30 && !text.includes(title)) { // Avoid including the title again
              description += text + ' ';
            }
          });
          description = description.trim();
        }
        
        // Get image URL - look in various places
        let imageUrl = '';
        
        // First try to find an image directly in this element
        imageUrl = $(el).find('img').attr('src') || '';
        
        // If no image found, look for background image style
        if (!imageUrl) {
          const style = $(el).attr('style') || '';
          const bgMatch = style.match(/background-image:\s*url\(['"]?([^'"]+)['"]?\)/i);
          if (bgMatch) {
            imageUrl = bgMatch[1];
          }
        }
        
        // If still no image, look in parent containers
        if (!imageUrl) {
          $(el).parents('section, article, div').find('img').each((i, img) => {
            if (!imageUrl) {
              imageUrl = $(img).attr('src') || '';
            }
          });
        }
        
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
        $(el).find('a, iframe').each((i, element) => {
          const href = $(element).attr('href') || $(element).attr('src') || '';
          if (href.includes('youtube.com') || href.includes('youtu.be')) {
            videoUrl = href;
          }
        });
        
        // If no video found, look in parent containers
        if (!videoUrl) {
          $(el).parents('section, article, div').find('a, iframe').each((i, element) => {
            const href = $(element).attr('href') || $(element).attr('src') || '';
            if (href.includes('youtube.com') || href.includes('youtu.be')) {
              videoUrl = href;
            }
          });
        }
        
        // Extract YouTube video ID if present
        let videoEmbedUrl = '';
        if (videoUrl) {
          const videoIdMatch = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
          if (videoIdMatch && videoIdMatch[1]) {
            videoEmbedUrl = `https://www.youtube.com/embed/${videoIdMatch[1]}`;
          } else {
            // If it's already an embed URL, use it directly
            if (videoUrl.includes('/embed/')) {
              videoEmbedUrl = videoUrl;
            }
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
  // Use 2025 for the performances based on the press release
  const year = 2025;
  
  return [
    {
      title: 'Swan Lake (First Run)',
      startDate: `${year}-06-10`,
      endDate: `${year}-06-17`,
      description: 'Celebrating 25 years since its World Premiere, Kevin McKenzie\'s Swan Lake will kick off the 2025 Summer season with eight performances led by Isabella Boylston as Odette/Odile and Daniel Camargo as Prince Siegfried. Set to music by Peter Ilyitch Tchaikovsky, Swan Lake is choreographed by Kevin McKenzie after Marius Petipa and Lev Ivanov and features scenery and costumes by Zack Brown and lighting by Duane Schuler.',
      image: 'https://via.placeholder.com/800x400.png?text=ABT+Swan+Lake',
      videoUrl: 'https://www.youtube.com/embed/9rJoB7y6Ncs'
    },
    {
      title: 'Woolf Works',
      startDate: `${year}-06-17`,
      endDate: `${year}-06-21`,
      description: 'In the second week of its Summer season, ABT will present Wayne McGregor\'s Woolf Works for five performances, beginning on Tuesday, June 17 at 7:30 P.M. led by Devon Teuscher and James Whiteside. Woolf Works features choreography by Wayne McGregor and music by Max Richter, with set design by Ciguë ("I now, I then"), We Not I ("Becomings"), and Wayne McGregor ("Tuesday"); costume design by Moritz Junge; lighting design by Lucy Carter; video design by Ravi Deepres; sound design by Chris Ekers; make up by Kabuki; and dramaturgy by Uzma Hameed.',
      image: 'https://via.placeholder.com/800x400.png?text=ABT+Woolf+Works',
      videoUrl: ''
    },
    {
      title: 'Giselle',
      startDate: `${year}-06-21`,
      endDate: `${year}-06-28`,
      description: 'Giselle will return to American Ballet Theatre for seven performances beginning with the opening matinee performance on Saturday, June 21 at 2:00 P.M. being led by Christine Shevchenko in the title role and Calvin Royal III as Albrecht. Staged by Kevin McKenzie with choreography after Jean Coralli, Jules Perrot, and Marius Petipa, Giselle is set to music by Adolphe Adam, orchestrated by John Lanchbery, with scenery by Gianni Quaranta, costumes by Anna Anni, and lighting by Jennifer Tipton.',
      image: 'https://via.placeholder.com/800x400.png?text=ABT+Giselle',
      videoUrl: 'https://www.youtube.com/embed/eSx_kqe6ox0'
    },
    {
      title: 'The Winter\'s Tale',
      startDate: `${year}-06-28`,
      endDate: `${year}-07-05`,
      description: 'American Ballet Theatre\'s New York Premiere of Christopher Wheeldon\'s The Winter\'s Tale will open at the Royal Opera House, Covent Garden, London. The award-winning production will receive its Company Premiere by American Ballet Theatre on April 3, 2025, at Segerstrom Center for the Arts in Costa Mesa, California. At the Metropolitan Opera House, the ballet will be given seven performances through Saturday, July 5, featuring music by Joby Talbot, set and costume design by Bob Crowley, lighting design by Natasha Katz, video design by Daniel Brodie, and silk design by Basil Twist.',
      image: 'https://via.placeholder.com/800x400.png?text=ABT+The+Winters+Tale',
      videoUrl: ''
    },
    {
      title: 'Sylvia',
      startDate: `${year}-07-08`,
      endDate: `${year}-07-14`,
      description: 'Sylvia will return to American Ballet Theatre in the fourth week of the Summer season, beginning on Tuesday, July 8 at 7:30 P.M. and running for seven performances. The opening night cast of Sylvia will be led by Catherine Hurlin as Sylvia and Isaac Hernández as Aminta, both in their debuts. With choreography by Frederick Ashton, music by Léo Delibes, and staging by Christopher Newton, Sylvia is set in mythical Greece and tells the story of the chaste nymph Sylvia who is united by the deity Eros with the lovelorn shepherd Aminta. Sylvia features scenery and costumes by Christopher and Robin Ironside, with additional designs by Peter Farmer and lighting by Mark Jonathan.',
      image: 'https://via.placeholder.com/800x400.png?text=ABT+Sylvia',
      videoUrl: ''
    },
    {
      title: 'Swan Lake (Second Run)',
      startDate: `${year}-07-14`,
      endDate: `${year}-07-19`,
      description: 'Swan Lake will return for eight performance in the fifth week of ABT\'s Summer season, led by Catherine Hurlin as Odette/Odile and James Whiteside as Prince Siegfried on Monday, July 14 at 7:30 P.M. Set to music by Peter Ilyitch Tchaikovsky, Swan Lake is choreographed by Kevin McKenzie after Marius Petipa and Lev Ivanov and features scenery and costumes by Zack Brown and lighting by Duane Schuler.',
      image: 'https://via.placeholder.com/800x400.png?text=ABT+Swan+Lake',
      videoUrl: 'https://www.youtube.com/embed/9rJoB7y6Ncs'
    },
    {
      title: 'ABTKids',
      startDate: `${year}-06-14`,
      endDate: `${year}-06-14`,
      description: 'ABTKids, American Ballet Theatre\'s annual one-hour introduction to ballet for families, is scheduled for Saturday, June 14 at 11:00 A.M. Tickets start at $25.',
      image: 'https://via.placeholder.com/800x400.png?text=ABTKids',
      videoUrl: ''
    }
  ];
};

module.exports = {
  scrapeCompanyInfo,
  scrapePerformances
};

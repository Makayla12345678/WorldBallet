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
    
    // Define season URLs to scrape
    const seasonUrls = [
      'https://national.ballet.ca/performances/202425-season',
      'https://national.ballet.ca/performances/202526-season'
    ];
    
    let allPerformances = [];
    
    // Scrape each season URL
    for (const url of seasonUrls) {
      try {
        console.log(`Scraping performances from ${url}...`);
        const response = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
        
        const $ = cheerio.load(response.data);
        
        const seasonPerformances = [];
        
        // First try to find performances in the upcoming-list
        const upcomingPerformances = [];
        $('.upcoming-list-item').each((i, el) => {
          try {
            const $el = $(el);
            
            // Extract date text
            const dateText = $el.find('.upcoming-themed-pretitle p').text().trim();
            
            // Extract title
            const title = $el.find('.accent').text().trim();
            
            if (!dateText || !title) {
              return; // Skip if no date or title found
            }
            
            // Skip section headers like "Upcoming Productions"
            if (title === "Upcoming Productions" || title.includes("Season") || title.includes("Productions")) {
              console.log(`Skipping section header: ${title}`);
              return;
            }
            
            console.log(`Found performance: ${title} (${dateText})`);
            
            // Parse date range
            let startDate = null;
            let endDate = null;
            
            // Try to match different date formats
            // Format: "November 1 – 8 2025" (same month)
            let dateMatch = dateText.match(/([A-Za-z]+)\s+(\d+)\s*[–-]\s*(\d+)\s+(\d{4})/);
            if (dateMatch) {
              const month = dateMatch[1];
              const startDay = dateMatch[2];
              const endDay = dateMatch[3];
              const year = dateMatch[4];
              startDate = new Date(`${month} ${startDay}, ${year}`);
              endDate = new Date(`${month} ${endDay}, ${year}`);
            } else {
              // Format: "February 27 – March 6 2026" (different months)
              dateMatch = dateText.match(/([A-Za-z]+)\s+(\d+)\s*[–-]\s*([A-Za-z]+)\s+(\d+)\s+(\d{4})/);
              if (dateMatch) {
                const startMonth = dateMatch[1];
                const startDay = dateMatch[2];
                const endMonth = dateMatch[3];
                const endDay = dateMatch[4];
                const year = dateMatch[5];
                startDate = new Date(`${startMonth} ${startDay}, ${year}`);
                endDate = new Date(`${endMonth} ${endDay}, ${year}`);
              } else {
                // Try another format: "May 30 – June 5 2025" (different months, no comma)
                dateMatch = dateText.match(/([A-Za-z]+)\s+(\d+)\s*[–-]\s*([A-Za-z]+)\s+(\d+)\s+(\d{4})/);
                if (dateMatch) {
                  const startMonth = dateMatch[1];
                  const startDay = dateMatch[2];
                  const endMonth = dateMatch[3];
                  const endDay = dateMatch[4];
                  const year = dateMatch[5];
                  startDate = new Date(`${startMonth} ${startDay}, ${year}`);
                  endDate = new Date(`${endMonth} ${endDay}, ${year}`);
                } else {
                  // Try yet another format: "December 5 – 31 2025" (same month)
                  dateMatch = dateText.match(/([A-Za-z]+)\s+(\d+)\s*[–-]\s*(\d+)\s+(\d{4})/);
                  if (dateMatch) {
                    const month = dateMatch[1];
                    const startDay = dateMatch[2];
                    const endDay = dateMatch[3];
                    const year = dateMatch[4];
                    startDate = new Date(`${month} ${startDay}, ${year}`);
                    endDate = new Date(`${month} ${endDay}, ${year}`);
                  } else {
                    console.log(`Could not parse date: "${dateText}"`);
                    
                    // Extract year from the date text
                    const yearMatch = dateText.match(/\b(\d{4})\b/);
                    if (!yearMatch) {
                      return; // Skip if no year found
                    }
                    
                    const year = yearMatch[1];
                    
                    // Extract month names
                    const monthMatch = dateText.match(/([A-Za-z]+)/g);
                    if (!monthMatch || monthMatch.length === 0) {
                      return; // Skip if no month found
                    }
                    
                    // Extract day numbers
                    const dayMatch = dateText.match(/\b(\d{1,2})\b/g);
                    if (!dayMatch || dayMatch.length < 2) {
                      return; // Skip if not enough days found
                    }
                    
                    // Use the extracted information to create dates
                    if (monthMatch.length === 1) {
                      // Same month for start and end
                      startDate = new Date(`${monthMatch[0]} ${dayMatch[0]}, ${year}`);
                      endDate = new Date(`${monthMatch[0]} ${dayMatch[1]}, ${year}`);
                    } else if (monthMatch.length >= 2) {
                      // Different months for start and end
                      startDate = new Date(`${monthMatch[0]} ${dayMatch[0]}, ${year}`);
                      endDate = new Date(`${monthMatch[1]} ${dayMatch[1]}, ${year}`);
                    } else {
                      return; // Skip if parsing fails
                    }
                  }
                }
              }
            }
            
            // Format dates as YYYY-MM-DD
            const formatDate = (date) => {
              return date.toISOString().split('T')[0];
            };
            
            // Get description (if available)
            let description = '';
            $el.find('p').each((i, p) => {
              if (i > 0) { // Skip the first paragraph (date)
                const text = $(p).text().trim();
                if (text.length > 5) {
                  description += text + ' ';
                }
              }
            });
            description = description.trim() || `${title} - National Ballet of Canada performance`;
            
            // Get image URL (if available) - try multiple selectors to find the image
            let imageUrl = '';
            
            // First try to find image directly in the element
            imageUrl = $el.find('img').attr('src') || '';
            
            // If no image found, try to find it in parent or sibling elements
            if (!imageUrl) {
              // Try parent element
              imageUrl = $el.parent().find('img').attr('src') || '';
              
              // Try sibling elements
              if (!imageUrl) {
                imageUrl = $el.siblings().find('img').attr('src') || '';
              }
              
              // Try looking for background image in style attribute
              if (!imageUrl) {
                const styleAttr = $el.attr('style') || $el.parent().attr('style') || '';
                const bgMatch = styleAttr.match(/background-image:\s*url\(['"]?([^'"]+)['"]?\)/i);
                if (bgMatch && bgMatch[1]) {
                  imageUrl = bgMatch[1];
                }
              }
            }
            
            // Special handling for known performances
            if (title === 'Anna Karenina') {
              // Always use a hardcoded image URL for Anna Karenina from the production page
              imageUrl = 'https://national.ballet.ca/assets/uploads/images/Anna-Karenina-1920x1080.jpg';
              console.log(`Using hardcoded Anna Karenina image: ${imageUrl}`);
            }
            
            // Ensure image URL is absolute
            if (imageUrl && !imageUrl.startsWith('http')) {
              // Handle different relative URL formats
              if (imageUrl.startsWith('//')) {
                imageUrl = `https:${imageUrl}`;
              } else if (imageUrl.startsWith('/')) {
                imageUrl = `https://national.ballet.ca${imageUrl}`;
              } else {
                imageUrl = `https://national.ballet.ca/${imageUrl}`;
              }
            }
            
            // Default image if none found
            if (!imageUrl) {
              imageUrl = `https://via.placeholder.com/800x400.png?text=${encodeURIComponent(title)}`;
            }
            
            console.log(`Image URL for ${title}: ${imageUrl}`);
            
            // Create performance object
            const performance = {
              title,
              startDate: formatDate(startDate),
              endDate: formatDate(endDate),
              description,
              image: imageUrl,
              videoUrl: ''
            };
            
            // Check if this performance is already in the list (avoid duplicates)
            const isDuplicate = upcomingPerformances.some(p => 
              p.title === performance.title && 
              (Math.abs(new Date(p.startDate) - new Date(performance.startDate)) < 1000 * 60 * 60 * 24 * 2) // Within 2 days
            );
            
            if (!isDuplicate) {
              upcomingPerformances.push(performance);
            } else {
              console.log(`Skipping duplicate performance: ${title}`);
            }
          } catch (err) {
            console.error('Error parsing upcoming performance:', err);
          }
        });
        
        if (upcomingPerformances.length > 0) {
          console.log(`Found ${upcomingPerformances.length} performances in upcoming-list`);
          seasonPerformances.push(...upcomingPerformances);
        } else {
          // Fallback to the original method if no performances found in upcoming-list
          // Select performance containers - look for sections with dates and titles
          $('section, article, div').each((i, el) => {
            try {
              // Look for date text in format like "May 30 - June 5, 2025"
              const dateText = $(el).find('time, [class*="date"], [class*="Date"]').text().trim() || 
                               $(el).children().first().text().match(/[A-Z][a-z]+ \d+\s*[-–]\s*[A-Z][a-z]+ \d+,\s*\d{4}/)?.[0] || '';
              
              if (!dateText || !dateText.match(/\d{4}/)) {
                return; // Skip if no valid date text found
              }
              
              // Extract performance details
              const title = $(el).find('h1, h2, h3').first().text().trim() || 'Unknown Title';
              
              // Skip section headers like "Upcoming Productions"
              if (title === "Upcoming Productions" || title.includes("Season") || title.includes("Productions")) {
                console.log(`Skipping section header: ${title}`);
                return;
              }
              
              // Parse date range
              let startDate = null;
              let endDate = null;
              
              // Try to match different date formats
              // Format 1: "May 30 - June 5, 2025"
              let dateMatch = dateText.match(/([A-Za-z]+\s+\d+)\s*[-–]\s*([A-Za-z]+\s+\d+),\s*(\d{4})/);
              if (dateMatch) {
                const startMonthDay = dateMatch[1];
                const endMonthDay = dateMatch[2];
                const year = dateMatch[3];
                startDate = new Date(`${startMonthDay}, ${year}`);
                endDate = new Date(`${endMonthDay}, ${year}`);
              } else {
                // Format 2: "June 13 - 21, 2025" (same month)
                dateMatch = dateText.match(/([A-Za-z]+\s+\d+)\s*[-–]\s*(\d+),\s*(\d{4})/);
                if (dateMatch) {
                  const startMonthDay = dateMatch[1];
                  const endDay = dateMatch[2];
                  const year = dateMatch[3];
                  startDate = new Date(`${startMonthDay}, ${year}`);
                  
                  // Extract month from startMonthDay
                  const month = startMonthDay.split(' ')[0];
                  endDate = new Date(`${month} ${endDay}, ${year}`);
                } else {
                  // Default dates if parsing fails
                  console.log(`Could not parse date: "${dateText}"`);
                  startDate = new Date();
                  endDate = new Date();
                  endDate.setDate(endDate.getDate() + 14); // Two weeks from now
                }
              }
              
              // Format dates as YYYY-MM-DD
              const formatDate = (date) => {
                return date.toISOString().split('T')[0];
              };
              
              // Get description from paragraphs following the title
              let description = '';
              $(el).find('p').each((i, p) => {
                const text = $(p).text().trim();
                if (text.length > 30) { // Only include substantial paragraphs
                  description += text + ' ';
                }
              });
              description = description.trim() || '';
              
              // Get image URL - try multiple selectors to find the image
              let imageUrl = '';
              
              // First try to find image directly in the element
              imageUrl = $(el).find('img').attr('src') || '';
              
              // If no image found, try to find it in parent or sibling elements
              if (!imageUrl) {
                // Try parent element
                imageUrl = $(el).parent().find('img').attr('src') || '';
                
                // Try sibling elements
                if (!imageUrl) {
                  imageUrl = $(el).siblings().find('img').attr('src') || '';
                }
                
                // Try looking for background image in style attribute
                if (!imageUrl) {
                  const styleAttr = $(el).attr('style') || $(el).parent().attr('style') || '';
                  const bgMatch = styleAttr.match(/background-image:\s*url\(['"]?([^'"]+)['"]?\)/i);
                  if (bgMatch && bgMatch[1]) {
                    imageUrl = bgMatch[1];
                  }
                }
              }
              
              // Special handling for known performances
              if (title === 'Anna Karenina') {
                // Always use a hardcoded image URL for Anna Karenina from the production page
                imageUrl = 'https://national.ballet.ca/assets/uploads/images/Anna-Karenina-1920x1080.jpg';
                console.log(`Using hardcoded Anna Karenina image: ${imageUrl}`);
              }
              
              // Ensure image URL is absolute
              if (imageUrl && !imageUrl.startsWith('http')) {
                // Handle different relative URL formats
                if (imageUrl.startsWith('//')) {
                  imageUrl = `https:${imageUrl}`;
                } else if (imageUrl.startsWith('/')) {
                  imageUrl = `https://national.ballet.ca${imageUrl}`;
                } else {
                  imageUrl = `https://national.ballet.ca/${imageUrl}`;
                }
              }
              
              // Default image if none found
              if (!imageUrl) {
                imageUrl = `https://via.placeholder.com/800x400.png?text=${encodeURIComponent(title)}`;
              }
              
              console.log(`Image URL for ${title}: ${imageUrl}`);
              
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
              
              // Check if this performance is already in the list (avoid duplicates)
              const isDuplicate = seasonPerformances.some(p => 
                p.title === performance.title && 
                (Math.abs(new Date(p.startDate) - new Date(performance.startDate)) < 1000 * 60 * 60 * 24 * 2) // Within 2 days
              );
              
              if (!isDuplicate) {
                seasonPerformances.push(performance);
              } else {
                console.log(`Skipping duplicate performance: ${title}`);
              }
            } catch (err) {
              console.error('Error parsing performance:', err);
            }
          });
        }
        
        console.log(`Scraped ${seasonPerformances.length} performances from ${url}`);
        allPerformances = [...allPerformances, ...seasonPerformances];
      } catch (error) {
        console.error(`Error scraping ${url}:`, error);
      }
    }
    
    console.log(`Scraped ${allPerformances.length} total performances from National Ballet of Canada`);
    
    // Only use mock data if absolutely no performances were found
    if (allPerformances.length === 0) {
      console.warn('No performances found, falling back to mock data');
      return getMockPerformances();
    }
    
    return allPerformances;
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

# Adding Support for More Ballet Companies

This guide will walk you through the process of adding support for additional ballet companies to the World Ballets project. This involves creating new scrapers for the backend and company pages for the frontend.

## Prerequisites

Before starting, ensure you have:
- Completed the MongoDB Atlas setup (see mongodb-atlas-setup.md)
- Deployed the backend server (see backend-deployment.md)
- Integrated the frontend with the backend (see frontend-backend-integration.md)

## Step 1: Create a New Scraper

For each new ballet company, you need to create a scraper that extracts company information and performance data from their official website.

1. Create a new file in the `server/scrapers` directory:

```bash
touch server/scrapers/pob.js  # Example for Paris Opera Ballet
```

2. Implement the scraper using the following template:

```javascript
const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Scrape [Company Name] company information
 * @returns {Promise<Object>} - Company information
 */
const scrapeCompanyInfo = async () => {
  try {
    console.log('Scraping [Company Name] company info...');
    
    // Fetch the about page
    const response = await axios.get('[Company Website URL]/about', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    
    // Extract company information
    // This will vary based on the structure of the company's website
    let description = '';
    $('.about-content p').each((i, el) => {
      description += $(el).text().trim() + ' ';
    });
    
    // Fallback description if scraping fails
    description = description.trim() || '[Default Company Description]';
    
    // Get logo URL
    let logoUrl = $('.logo img').attr('src') || 'https://via.placeholder.com/150x150.png?text=[COMPANY_SHORTNAME]+Logo';
    
    // Ensure logo URL is absolute
    if (logoUrl && !logoUrl.startsWith('http')) {
      logoUrl = `[Company Website URL]${logoUrl}`;
    }
    
    // Create company info object
    const companyInfo = {
      name: '[Full Company Name]',
      shortName: '[COMPANY_SHORTNAME]',
      description,
      logo: logoUrl,
      website: '[Company Website URL]'
    };
    
    console.log('[Company Name] company info scraped successfully');
    return companyInfo;
  } catch (error) {
    console.error('Error scraping [Company Name] company info:', error);
    
    // Return default info if scraping fails
    return {
      name: '[Full Company Name]',
      shortName: '[COMPANY_SHORTNAME]',
      description: '[Default Company Description]',
      logo: 'https://via.placeholder.com/150x150.png?text=[COMPANY_SHORTNAME]+Logo',
      website: '[Company Website URL]'
    };
  }
};

/**
 * Scrape [Company Name] performances
 * @returns {Promise<Array>} - Array of performance objects
 */
const scrapePerformances = async () => {
  try {
    console.log('Scraping [Company Name] performances...');
    
    // Fetch the performances page
    const response = await axios.get('[Company Website URL]/performances', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    
    const performances = [];
    
    // Select performance containers
    // This will vary based on the structure of the company's website
    $('.performance-item').each((i, el) => {
      try {
        // Extract performance details
        const title = $(el).find('h2').text().trim() || 'Unknown Title';
        const dateText = $(el).find('.dates').text().trim() || '';
        
        // Parse date range
        let startDate = null;
        let endDate = null;
        
        // Date parsing logic will vary based on the format used by the company
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
          imageUrl = `[Company Website URL]${imageUrl}`;
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
    
    console.log(`Scraped ${performances.length} performances from [Company Name]`);
    
    // If no performances were found, return mock data
    if (performances.length === 0) {
      return getMockPerformances();
    }
    
    return performances;
  } catch (error) {
    console.error('Error scraping [Company Name] performances:', error);
    
    // Return mock data if scraping fails
    return getMockPerformances();
  }
};

/**
 * Get mock performances for [Company Name]
 * @returns {Array} - Array of mock performance objects
 */
const getMockPerformances = () => {
  const currentYear = new Date().getFullYear();
  
  return [
    {
      title: '[Performance Title 1]',
      startDate: `${currentYear}-03-15`,
      endDate: `${currentYear}-04-05`,
      description: '[Performance Description 1]',
      image: `https://via.placeholder.com/800x400.png?text=${encodeURIComponent('[Performance Title 1]')}`,
      videoUrl: 'https://www.youtube.com/embed/EXAMPLE_VIDEO_ID_1'
    },
    {
      title: '[Performance Title 2]',
      startDate: `${currentYear}-05-10`,
      endDate: `${currentYear}-05-20`,
      description: '[Performance Description 2]',
      image: `https://via.placeholder.com/800x400.png?text=${encodeURIComponent('[Performance Title 2]')}`,
      videoUrl: 'https://www.youtube.com/embed/EXAMPLE_VIDEO_ID_2'
    },
    // Add more mock performances as needed
  ];
};

module.exports = {
  scrapeCompanyInfo,
  scrapePerformances
};
```

3. Replace the placeholders with actual information for the ballet company:
   - `[Company Name]` - The name of the ballet company (e.g., "Paris Opera Ballet")
   - `[COMPANY_SHORTNAME]` - The short name or abbreviation (e.g., "POB")
   - `[Company Website URL]` - The URL of the company's official website
   - `[Default Company Description]` - A brief description of the company
   - `[Performance Title X]` - Titles for mock performances
   - `[Performance Description X]` - Descriptions for mock performances

4. Customize the scraping logic based on the structure of the company's website:
   - Inspect the company's website to identify the HTML elements containing the information you need
   - Update the selectors in the scraper to match the website's structure
   - Test the scraper to ensure it correctly extracts the information

## Step 2: Register the New Scraper

Update the `server/scrapers/index.js` file to include the new scraper:

1. Add the require statement at the top of the file:

```javascript
const pobScraper = require('./pob'); // Example for Paris Opera Ballet
```

2. Update the `scrapeAll` function to include the new company:

```javascript
const scrapeAll = async () => {
  console.log('Starting scraping for all companies...');
  
  try {
    // Existing companies
    await scrapeCompany('nbc');
    await scrapeCompany('abt');
    
    // New company
    await scrapeCompany('pob'); // Example for Paris Opera Ballet
    
    // TODO: Add other companies as they are implemented
    // await scrapeCompany('bolshoi');
    // await scrapeCompany('royal');
    // await scrapeCompany('stuttgart');
    // await scrapeCompany('boston');
    
    console.log('All companies scraped successfully');
    return true;
  } catch (error) {
    console.error('Error during scraping:', error);
    throw error;
  }
};
```

3. Update the `scrapeCompany` function to use the new scraper:

```javascript
const scrapeCompany = async (companyId) => {
  console.log(`Scraping ${companyId}...`);
  
  try {
    let companyInfo;
    let performances;
    
    // Use the appropriate scraper based on company ID
    switch (companyId) {
      case 'nbc':
        companyInfo = await nbcScraper.scrapeCompanyInfo();
        performances = await nbcScraper.scrapePerformances();
        break;
      case 'abt':
        companyInfo = await abtScraper.scrapeCompanyInfo();
        performances = await abtScraper.scrapePerformances();
        break;
      case 'pob': // Example for Paris Opera Ballet
        companyInfo = await pobScraper.scrapeCompanyInfo();
        performances = await pobScraper.scrapePerformances();
        break;
      // TODO: Add other companies as they are implemented
      default:
        throw new Error(`Scraper not implemented for company: ${companyId}`);
    }
    
    // Rest of the function remains the same
    // ...
  } catch (error) {
    console.error(`Error scraping ${companyId}:`, error);
    throw error;
  }
};
```

## Step 3: Create a Company Page

For each new ballet company, you need to create a company page in the frontend:

1. Create a new HTML file in the `companies` directory:

```bash
touch companies/pob.html  # Example for Paris Opera Ballet
```

2. Use the following template for the company page:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Full Company Name] - World Ballets</title>
    <link rel="stylesheet" href="../css/styles.css">
    <link rel="stylesheet" href="../css/company-page.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <header class="main-header">
        <div class="logo-container">
            <h1><a href="../index.html">WORLD BALLETS</a></h1>
        </div>
        <nav class="main-nav">
            <ul>
                <li><a href="abt.html" class="company-logo">ABT</a></li>
                <li><a href="pob.html" class="company-logo active">POB</a></li>
                <li><a href="bolshoi.html" class="company-logo">BOLSHOI</a></li>
                <li><a href="royal.html" class="company-logo">ROYAL</a></li>
                <li><a href="stuttgart.html" class="company-logo">STUTTGART</a></li>
                <li><a href="boston.html" class="company-logo">BOSTON</a></li>
                <li><a href="nbc.html" class="company-logo">NBC</a></li>
            </ul>
        </nav>
    </header>

    <section class="company-hero">
        <div class="company-info">
            <div class="company-logo-container">
                <img src="https://via.placeholder.com/150x150.png?text=[COMPANY_SHORTNAME]+Logo" alt="[Full Company Name] Logo" class="company-logo-img">
            </div>
            <h1>[FULL COMPANY NAME]</h1>
            <p class="company-description">
                [Default Company Description]
            </p>
        </div>
    </section>

    <section class="current-performances">
        <h2>NOW PLAYING & UPCOMING PERFORMANCES</h2>
        
        <div class="performance-container" id="currentPerformances">
            <!-- Performances will be populated by JavaScript -->
            <div class="loading-indicator">Loading performances...</div>
        </div>
    </section>

    <section class="past-performances">
        <h2>PAST PERFORMANCES</h2>
        <button class="toggle-past-btn" id="togglePastBtn">Show Past Performances</button>
        
        <div class="performance-container hidden" id="pastPerformances">
            <!-- Past performances will be populated by JavaScript -->
        </div>
    </section>

    <footer>
        <div class="footer-content">
            <p>&copy; 2025 World Ballets. All rights reserved.</p>
            <p>Data sourced from official ballet company websites.</p>
        </div>
    </footer>

    <script src="../js/scraper.js"></script>
    <script src="../js/data-service.js"></script>
    <script src="../js/ui-controller.js"></script>
    <script src="../js/company-page.js"></script>
</body>
</html>
```

3. Replace the placeholders with actual information for the ballet company:
   - `[Full Company Name]` - The full name of the ballet company (e.g., "Paris Opera Ballet")
   - `[FULL COMPANY NAME]` - The full name in uppercase (e.g., "PARIS OPERA BALLET")
   - `[COMPANY_SHORTNAME]` - The short name or abbreviation (e.g., "POB")
   - `[Default Company Description]` - A brief description of the company

4. Update the navigation links:
   - Make sure the `active` class is on the correct company link
   - Ensure all company links are correct

## Step 4: Update Navigation in All Pages

Update the navigation in all existing pages to include the new company:

1. Update the navigation in `index.html`:

```html
<nav class="main-nav">
    <ul>
        <li><a href="companies/abt.html" class="company-logo">ABT</a></li>
        <li><a href="companies/pob.html" class="company-logo">POB</a></li>
        <li><a href="companies/bolshoi.html" class="company-logo">BOLSHOI</a></li>
        <li><a href="companies/royal.html" class="company-logo">ROYAL</a></li>
        <li><a href="companies/stuttgart.html" class="company-logo">STUTTGART</a></li>
        <li><a href="companies/boston.html" class="company-logo">BOSTON</a></li>
        <li><a href="companies/nbc.html" class="company-logo">NBC</a></li>
    </ul>
</nav>
```

2. Update the navigation in all company pages to ensure consistency.

## Step 5: Test the New Company

1. Start the backend server:

```bash
cd server
npm run dev
```

2. Run a manual scrape to populate the database with the new company's data:

```bash
# In a new terminal
cd server
npm run scrape
```

3. Open the World Ballets website in a browser and navigate to the new company page:
   - Verify that the company information is displayed correctly
   - Check that performances are loaded and displayed properly
   - Test the "Show Past Performances" functionality

## Troubleshooting

### Scraper Issues

If the scraper is not working correctly:

1. Check the company's website structure:
   - Use browser developer tools to inspect the HTML elements
   - Verify that the selectors in your scraper match the website's structure

2. Test the scraper in isolation:
   - Create a test script to run just the scraper functions
   - Check the console output for any errors

3. Common issues:
   - Incorrect selectors
   - Changes in the website's structure
   - CORS or rate limiting by the website

### Database Issues

If the data is not being saved to the database:

1. Check the MongoDB connection:
   - Verify that the connection string in `.env` is correct
   - Ensure the database is accessible

2. Check the console for database errors:
   - Look for error messages related to MongoDB
   - Verify that the models are defined correctly

### Frontend Issues

If the company page is not displaying correctly:

1. Check the browser console for errors:
   - Look for JavaScript errors
   - Check for network request failures

2. Verify the data-service.js integration:
   - Ensure the API endpoints are correct
   - Check that the company ID matches between frontend and backend

## Next Steps

After adding support for a new ballet company:

1. Consider enhancing the scraper:
   - Add more detailed information

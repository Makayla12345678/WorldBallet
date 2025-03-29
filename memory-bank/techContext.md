# World Ballets Technical Context

## Technology Stack

### Frontend Technologies

| Technology | Purpose | Description |
|------------|---------|-------------|
| HTML5 | Structure | Semantic markup for content structure |
| CSS3 | Styling | Custom styling with responsive design |
| JavaScript (ES6+) | Functionality | Client-side interactivity and data handling |
| Google Fonts | Typography | Montserrat and Playfair Display font families |

### Backend Technologies

| Technology | Purpose | Description |
|------------|---------|-------------|
| Node.js | Runtime | JavaScript runtime for server-side code |
| Express | Web Framework | Handles HTTP requests and API routing |
| MongoDB | Database | NoSQL database for storing scraped data |
| Mongoose | ODM | Object Data Modeling for MongoDB |
| Cheerio | Web Scraping | HTML parsing and manipulation for scraping |
| Axios | HTTP Client | Promise-based HTTP client for making requests |
| Node-cron | Scheduling | Task scheduler for automated scraping |
| Dotenv | Configuration | Environment variable management |

## Development Environment

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Modern web browser with developer tools

### Local Setup

1. **Frontend**
   - No build process required
   - Served directly from file system or simple HTTP server
   - Browser with developer tools for debugging

2. **Backend**
   - Node.js environment
   - npm for package management
   - MongoDB connection (local or Atlas)
   - Environment variables configured in `.env` file

### Development Workflow

1. **Frontend Development**
   - Edit HTML, CSS, and JavaScript files directly
   - Refresh browser to see changes
   - Use browser developer tools for debugging
   - Test with mock data when backend is unavailable

2. **Backend Development**
   - Run server in development mode with auto-restart
   - Test API endpoints with browser or tools like Postman
   - Debug scraping functions with manual triggers
   - Monitor MongoDB data with MongoDB Compass or similar tool

## Project Structure

```
world-ballets/
├── index.html                  # Main entry point
├── companies/                  # Company-specific pages
│   ├── abt.html
│   ├── nbc.html
│   └── ...
├── css/                        # Stylesheets
│   ├── styles.css              # Main styles
│   └── company-page.css        # Company page specific styles
├── js/                         # Frontend JavaScript
│   ├── main.js                 # Main application logic
│   ├── data-service.js         # Data fetching and processing
│   ├── ui-controller.js        # UI updates and event handling
│   ├── company-page.js         # Company page specific logic
│   └── scraper.js              # Client-side scraping fallback
├── images/                     # Image assets
│   └── ...
├── data/                       # Static data files (if needed)
│   └── ...
└── server/                     # Backend server
    ├── server.js               # Main server entry point
    ├── scrape.js               # Manual scraping trigger
    ├── package.json            # Node.js dependencies
    ├── .env                    # Environment variables
    ├── .gitignore              # Git ignore file
    ├── config/                 # Server configuration
    │   └── db.js               # Database connection
    ├── models/                 # Mongoose models
    │   ├── Company.js          # Company data model
    │   └── Performance.js      # Performance data model
    ├── routes/                 # API routes
    │   ├── companies.js        # Company-related endpoints
    │   └── performances.js     # Performance-related endpoints
    └── scrapers/               # Web scrapers
        ├── index.js            # Scraper orchestration
        ├── abt.js              # American Ballet Theatre scraper
        └── nbc.js              # National Ballet of Canada scraper
```

## API Structure

### Base URL
```
http://localhost:5000/api
```

### Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/companies` | GET | List all companies |
| `/companies/:id` | GET | Get company by ID |
| `/companies/:id/performances` | GET | Get performances for a company |
| `/performances` | GET | List all performances (with optional filters) |
| `/performances/current` | GET | Get current performances |
| `/performances/upcoming` | GET | Get upcoming performances |
| `/performances/:id` | GET | Get performance by ID |

## Data Models

### Company Model

```javascript
{
  _id: ObjectId,
  companyId: String,       // Short identifier (e.g., "abt")
  name: String,            // Full name (e.g., "American Ballet Theatre")
  shortName: String,       // Abbreviation (e.g., "ABT")
  logo: String,            // URL to company logo
  description: String,     // Company description
  website: String,         // Official website URL
  createdAt: Date,
  updatedAt: Date
}
```

### Performance Model

```javascript
{
  _id: ObjectId,
  performanceId: String,   // Unique identifier
  title: String,           // Performance title
  company: String,         // Reference to company ID
  startDate: Date,         // Performance start date
  endDate: Date,           // Performance end date
  description: String,     // Performance description
  image: String,           // URL to performance image
  videoUrl: String,        // URL to performance video (if available)
  isCurrent: Boolean,      // Flag for current performances
  isNext: Boolean,         // Flag for next upcoming performance
  isPast: Boolean,         // Flag for past performances
  createdAt: Date,
  updatedAt: Date
}
```

## Technical Constraints

1. **Cross-Origin Restrictions**
   - Client-side scraping limited by CORS policies
   - Server-side scraping required for most ballet websites

2. **External Dependencies**
   - Reliance on external websites' HTML structure
   - Scrapers need maintenance when source websites change

3. **Performance Considerations**
   - Scraping is resource-intensive and time-consuming
   - Caching and scheduled updates needed for performance

4. **Data Consistency**
   - Different ballet companies present data in different formats
   - Normalization required for consistent user experience

## Deployment Considerations

1. **Frontend Deployment**
   - Static file hosting (e.g., Netlify, Vercel, GitHub Pages)
   - CDN for improved global performance

2. **Backend Deployment**
   - Node.js hosting (e.g., Heroku, DigitalOcean, AWS)
   - MongoDB Atlas for database hosting
   - Environment variables for configuration

3. **Monitoring**
   - Logging for scraper performance and errors
   - Alerts for failed scraping attempts
   - Regular data validation checks

## Security Considerations

1. **API Security**
   - Rate limiting to prevent abuse
   - Input validation for all API parameters
   - CORS configuration for frontend access

2. **Scraping Ethics**
   - Respect robots.txt directives
   - Implement reasonable request delays
   - Proper user-agent identification

3. **Data Privacy**
   - No collection of user data
   - Attribution to source websites
   - Compliance with terms of service for scraped sites

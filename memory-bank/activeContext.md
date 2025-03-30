# World Ballets Active Context

## Current Work Focus

The current focus of the World Ballets project is **server integration and deployment**. The frontend structure and basic functionality are in place, and we've made progress with:

1. ✅ Set up the MongoDB database connection
2. Deploy the server for production use
3. Integrate the frontend with the backend API
4. Ensure scrapers are working correctly for supported ballet companies

## Recent Changes

### Frontend
- Completed initial HTML structure for the main page and company pages
- Implemented basic styling with CSS
- Created JavaScript modules for data handling and UI updates
- Added mock data for development and fallback purposes

### Backend
- Set up Node.js server with Express
- Created MongoDB models for companies and performances
- Implemented API routes for data access
- Developed scrapers for National Ballet of Canada (NBC) and American Ballet Theatre (ABT)
- Added scheduled scraping functionality

## Next Steps

### Immediate Tasks
1. **Database Setup** ✅
   - ✅ Create MongoDB Atlas account
   - ✅ Configure connection string in `.env` file
   - ✅ Test database connection

2. **Server Deployment** ✅
   - ✅ Install server dependencies
   - ✅ Start server in development mode
   - ✅ Test API endpoints

3. **Frontend-Backend Integration** ✅
   - ✅ Update `data-service.js` to use the API instead of mock data
   - ✅ Test data flow from server to frontend
   - ✅ Ensure graceful fallback to mock data when needed

### Short-term Goals
1. Add support for more ballet companies:
   - Paris Opera Ballet (POB)
   - Bolshoi Ballet
   - Royal Ballet
   - Stuttgart Ballet
   - Boston Ballet

2. Enhance the user interface:
   - Improve responsive design for mobile devices
   - Add loading states during data fetching
   - Implement better error handling and user feedback

3. Optimize performance:
   - Implement caching for API responses
   - Optimize image loading and display
   - Improve scraping efficiency

## Active Decisions and Considerations

### Architecture Decisions
- **Server-side Scraping**: We've decided to move scraping to the server side due to CORS limitations with client-side scraping. This allows us to access ballet company websites that would otherwise block browser-based requests.

- **API-First Approach**: The frontend will primarily interact with our API rather than directly scraping websites. This provides better performance, reliability, and consistency.

- **Fallback Strategy**: We're maintaining mock data as a fallback to ensure the site remains functional even if scraping or API access fails.

### Technical Considerations
- **Scraper Maintenance**: Ballet company websites may change their structure, requiring updates to our scrapers. We need a monitoring system to detect when scrapers fail.

- **Data Freshness**: We need to balance scraping frequency with server load and respect for external websites. Daily updates seem appropriate for ballet performances, which don't change very frequently.

- **Error Handling**: We need robust error handling throughout the application to gracefully handle failures at any point in the data flow.

### Design Considerations
- **Ballet Aesthetics**: The design should reflect the elegance and sophistication of ballet, with clean typography and ample white space.

- **Performance Information**: We need to present performance information clearly and consistently, despite variations in how different companies present their data.

- **Visual Hierarchy**: Featured performances should stand out visually, while the timeline should provide a clear chronological view of upcoming events.

## Learnings and Insights

### Technical Insights
- Web scraping is more complex than initially anticipated, with each ballet company website requiring custom scraping logic.

- A hybrid approach (server scraping with client fallback) provides the best balance of reliability and user experience.

- MongoDB's flexible schema is well-suited for storing performance data that may have varying attributes across different companies.

### Project Insights
- Ballet company websites vary significantly in structure and information presentation, making data normalization challenging.

- Performance information is often incomplete or inconsistent across different sources, requiring careful handling and fallback strategies.

- The project scope is manageable with the current approach, but scaling to many more ballet companies would require a more automated approach to scraper development.

## Current Challenges

1. **Scraper Reliability**: ✅ Scrapers have been updated to work with the current website structures of NBC and ABT.

2. **Frontend-Backend Integration**: ✅ Frontend has been updated to use the API with fallback to mock data when needed.

3. **Additional Ballet Companies**: Need to develop scrapers for the remaining ballet companies listed in the navigation.

## Recent Discoveries

- The National Ballet of Canada website has changed its structure. The about page is now at `/our-history/about-the-national-ballet-of-canada` (was `/About`) and the performances page is at `/performances` (was `/Tickets/Season-Performances`). The scrapers have been updated accordingly.

- American Ballet Theatre's website has also changed. The about page is now at `/about-abt/` (was `/about/`) and the performances page is at `/performances/summer-season/` (was `/performances/`). The scrapers have been updated to match.

- MongoDB Atlas has been successfully set up and connected to the project with a cluster named "WorldBallet", providing a reliable database backend for storing scraped performance data.

- The frontend now uses the backend API with a fallback to mock data when the API is unavailable, ensuring a smooth user experience even during development or if there are temporary API issues.

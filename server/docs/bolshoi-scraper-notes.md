# Bolshoi Ballet Scraper Notes

## Current Status (Updated 4/13/2025)
Successfully implemented and tested scraping from bolshoirussia.com:
- Website is accessible and provides structured performance data
- Filtering to include only ballet performances
- Information available for 6 months in advance
- Includes venue details (Main Stage/New Stage)
- Fully integrated with MongoDB database
- Test results: Successfully filtered and stored 15 ballet performances from 18 total performances
- Automatic deduplication of repeat performances

## Implementation Details
1. Data Source:
   - Using bolshoirussia.com/playbill/search/{month}-{year}/
   - Structured HTML with consistent class names
   - Reliable performance information

2. Scraping Configuration:
   - Puppeteer with stealth plugin
   - Browser fingerprinting evasion
   - Random delays between requests
   - Custom user agents and headers

3. Data Processing:
   - Deduplication using unique keys
   - Clean text formatting
   - Structured performance details
   - Comprehensive descriptions

## Data Structure
Each ballet performance includes:
- Title
- Date and time
- Venue (Main Stage/New Stage)
- Performance type (Ballet/Opera/Concert)
- Company
- Composer and choreographer info
- Detailed description

## Features
- [x] Automated scraping from reliable source
- [x] Deduplication of performances
- [x] Clean data formatting
- [x] Comprehensive performance details
- [x] Fallback to mock data if needed

## Next Steps
1. Short term: Monitor scraper reliability
2. Medium term: Add image scraping
3. Long term: Consider official API access if available

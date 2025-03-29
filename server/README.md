# World Ballets Server

A server-side scraper and API for the World Ballets website. This server scrapes ballet performance data from official ballet company websites and provides an API to access the data.

## Features

- Server-side web scraping of ballet company websites
- MongoDB database for storing scraped data
- RESTful API for accessing ballet company and performance data
- Scheduled daily scraping to keep data up-to-date
- Fallback to mock data when scraping fails

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (local installation or MongoDB Atlas account)

## Installation

1. **Install Node.js**

   Download and install Node.js from [nodejs.org](https://nodejs.org/).

2. **Set up MongoDB**

   Option 1: Create a free MongoDB Atlas account
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account
   - Create a new cluster
   - Create a database user
   - Get your connection string

   Option 2: Install MongoDB locally
   - Follow the [MongoDB installation guide](https://docs.mongodb.com/manual/installation/)

3. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd world-ballets/server
   ```

4. **Install dependencies**

   ```bash
   npm install
   ```

5. **Configure environment variables**

   Update the `.env` file with your MongoDB connection string:

   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/world-ballets?retryWrites=true&w=majority
   ```

## Usage

### Start the server

```bash
npm start
```

### Start the server in development mode (with auto-restart)

```bash
npm run dev
```

### Run a manual scrape

```bash
npm run scrape
```

## API Endpoints

### Companies

- `GET /api/companies` - Get all companies
- `GET /api/companies/:id` - Get company by ID
- `GET /api/companies/:id/performances` - Get performances for a specific company

### Performances

- `GET /api/performances` - Get all performances with optional filtering
- `GET /api/performances/current` - Get all current performances
- `GET /api/performances/upcoming` - Get all upcoming performances
- `GET /api/performances/:id` - Get performance by ID

## Scraping Schedule

By default, the scraper runs daily at 3 AM. You can modify the schedule in the `.env` file:

```
SCRAPE_INTERVAL="0 3 * * *" # Cron syntax
```

## Currently Supported Ballet Companies

- National Ballet of Canada (NBC)
- American Ballet Theatre (ABT)

## Adding New Ballet Companies

To add support for a new ballet company:

1. Create a new scraper file in the `scrapers` directory (e.g., `scrapers/pob.js`)
2. Implement the `scrapeCompanyInfo` and `scrapePerformances` functions
3. Update the `scrapers/index.js` file to include the new scraper

## Frontend Integration

To connect the frontend to this API:

1. Update the frontend data service to fetch data from the API instead of using the browser-based scraper
2. Update the API base URL in the frontend configuration

## License

This project is licensed under the MIT License.

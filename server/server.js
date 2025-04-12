const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const scraper = require('./scrapers/index');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..'))); // Serve frontend files

// Routes
app.use('/api/companies', require('./routes/companies'));
app.use('/api/performances', require('./routes/performances'));

// API Home route
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to the World Ballets API',
    endpoints: {
      companies: '/api/companies',
      performances: '/api/performances',
      companyPerformances: '/api/companies/:id/performances'
    }
  });
});

// Frontend routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.get('/companies/:company', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'companies', `${req.params.company}.html`));
});

// Schedule scraping job
const scrapeInterval = process.env.SCRAPE_INTERVAL || '0 3 * * *'; // Default: 3 AM daily
cron.schedule(scrapeInterval, async () => {
  console.log('Running scheduled scraping job...');
  try {
    await scraper.scrapeAll();
    console.log('Scheduled scraping completed successfully');
  } catch (error) {
    console.error('Scheduled scraping failed:', error);
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  
  // Run initial scrape if in development mode
  if (process.env.NODE_ENV === 'development') {
    console.log('Running initial scrape in development mode...');
    scraper.scrapeAll().catch(err => console.error('Initial scrape failed:', err));
  }
});

/**
 * Script to clear Boston Ballet performances from the database
 */

// Import required modules
const mongoose = require('mongoose');
const path = require('path');
const Performance = require('./models/Performance');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

// Main function to clear Boston Ballet performances
(async () => {
  try {
    console.log('Clearing Boston Ballet performances from database...');
    
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    
    // Delete Boston Ballet performances
    console.log('Deleting Boston Ballet performances...');
    const result = await Performance.deleteMany({ company: 'boston' });
    
    console.log(`Deleted ${result.deletedCount} Boston Ballet performances from database`);
    
    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error clearing Boston Ballet performances:', error);
    
    // Close database connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('Database connection closed');
    }
    
    process.exit(1);
  }
})();

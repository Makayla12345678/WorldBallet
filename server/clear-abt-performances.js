/**
 * Script to clear American Ballet Theatre performances from the database
 */

// Import required modules
const mongoose = require('mongoose');
const Performance = require('./models/Performance');
require('dotenv').config();

// Main function to clear ABT performances
(async () => {
  try {
    console.log('Clearing American Ballet Theatre performances from database...');
    
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    
    // Delete all ABT performances
    console.log('Deleting ABT performances...');
    const result = await Performance.deleteMany({ company: 'abt' });
    console.log(`Deleted ${result.deletedCount} ABT performances from database`);
    
    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error clearing ABT performances:', error);
    
    // Close database connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('Database connection closed');
    }
    
    process.exit(1);
  }
})();

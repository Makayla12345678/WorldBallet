/**
 * Script to clear Stuttgart Ballet performances from the database
 */

// Import required modules
const mongoose = require('mongoose');
const Performance = require('./models/Performance');
require('dotenv').config();

// Main function to clear Stuttgart Ballet performances
(async () => {
  try {
    console.log('Clearing Stuttgart Ballet performances from database...');
    
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    
    // Delete all Stuttgart Ballet performances
    console.log('Deleting Stuttgart Ballet performances...');
    const result = await Performance.deleteMany({ company: 'stuttgart' });
    console.log(`Deleted ${result.deletedCount} Stuttgart Ballet performances from database`);
    
    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error clearing Stuttgart Ballet performances:', error);
    
    // Close database connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('Database connection closed');
    }
    
    process.exit(1);
  }
})();

/**
 * Script to clear Royal Ballet performances from the database
 */

// Import required modules
const mongoose = require('mongoose');
const path = require('path');
const Performance = require('./models/Performance');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

// Main function to clear RB performances
(async () => {
  try {
    console.log('Clearing Royal Ballet performances from database...');
    
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    
    // Delete all RB performances
    console.log('Deleting RB performances...');
    const result = await Performance.deleteMany({ company: 'rb' });
    console.log(`Deleted ${result.deletedCount} RB performances from database`);
    
    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error clearing Royal Ballet performances:', error);
    
    // Close database connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('Database connection closed');
    }
    
    process.exit(1);
  }
})();

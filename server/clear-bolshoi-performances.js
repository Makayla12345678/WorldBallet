const mongoose = require('mongoose');
const Performance = require('./models/Performance');
const config = require('./config/db');

/**
 * Clear all Bolshoi Ballet performances from the database
 */
const clearBolshoiPerformances = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(config.url);
    
    console.log('Clearing Bolshoi Ballet performances...');
    const result = await Performance.deleteMany({ company: 'bolshoi' });
    
    console.log(`Deleted ${result.deletedCount} Bolshoi Ballet performances`);
    
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error clearing Bolshoi Ballet performances:', error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
  }
};

// Run the script
clearBolshoiPerformances();

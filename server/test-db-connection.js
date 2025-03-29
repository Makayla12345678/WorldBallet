// Simple script to test MongoDB connection

const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log(`Connection string: ${process.env.MONGODB_URI.replace(/:[^:]*@/, ':****@')}`);
    
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('✅ Successfully connected to MongoDB!');
    
    // List all collections in the database
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nCollections in the database:');
    if (collections.length === 0) {
      console.log('No collections found. Database is empty.');
    } else {
      collections.forEach(collection => {
        console.log(`- ${collection.name}`);
      });
    }
    
    // Close the connection
    await mongoose.connection.close();
    console.log('\nConnection closed.');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:');
    console.error(error);
  }
}

testConnection();

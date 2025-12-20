const mongoose = require('mongoose');
require('dotenv').config();

// Use the MONGO_URL from environment variables or fallback to the one in .env
const MONGO_URL = process.env.MONGO_URL || 'mongodb+srv://fibaaah:Jaseenamujeeb8830@fibaaah.dnfd5.mongodb.net/Capstone';

console.log('Connecting to MongoDB...');
console.log('MONGO_URL:', MONGO_URL);

mongoose.connect(MONGO_URL)
  .then(async () => {
    console.log('Connected to MongoDB successfully');
    
    // Import the Destination model
    const Destination = require('../models/destination.model');
    
    // Check total destinations
    const totalDestinations = await Destination.countDocuments();
    console.log(`Total destinations in database: ${totalDestinations}`);
    
    // Check approved destinations
    const approvedDestinations = await Destination.countDocuments({ isApproved: true });
    console.log(`Approved destinations: ${approvedDestinations}`);
    
    // Check popular destinations
    const popularDestinations = await Destination.countDocuments({ isPopular: true });
    console.log(`Popular destinations: ${popularDestinations}`);
    
    // Get sample destinations
    const sampleDestinations = await Destination.find({ isApproved: true }).limit(5);
    console.log('\nSample approved destinations:');
    sampleDestinations.forEach(dest => {
      console.log(`- ${dest.name} (Approved: ${dest.isApproved}, Popular: ${dest.isPopular})`);
    });
    
    // Get popular destinations
    const popularDests = await Destination.find({ isPopular: true, isApproved: true }).limit(5);
    console.log('\nPopular approved destinations:');
    popularDests.forEach(dest => {
      console.log(`- ${dest.name} (Rating: ${dest.rating})`);
    });
    
    mongoose.connection.close();
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  });
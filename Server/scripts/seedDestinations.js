const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Destination = require('../models/destination.model');
const User = require('../models/user.model');

dotenv.config();

const sampleDestinations = [];

const seedDestinations = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    // Find or create admin user
    let adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('Creating admin user for destinations...');
      adminUser = new User({
        username: 'admin',
        email: 'admin@wanderwise.com',
        password: 'admin123',
        role: 'admin',
        bio: 'System Administrator',
        isActive: true
      });
      await adminUser.save();
    }

    // Clear existing destinations
    await Destination.deleteMany({});
    console.log('Cleared existing destinations');

    // Destinations should only be added via the Admin Panel.
    console.log('✅ Admin user ready. Note: Destination cards should only be added via the unified Admin Panel, not via the seeder.');

  } catch (error) {
    console.error('❌ Error seeding destinations:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seedDestinations(); 
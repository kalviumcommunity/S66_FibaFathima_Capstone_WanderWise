const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Destination = require('../models/destination.model');
const User = require('../models/user.model');

dotenv.config();

const sampleDestinations = [
  {
    name: "Bali, Indonesia",
    description: "Tropical paradise with stunning beaches, ancient temples, and vibrant culture. Experience the perfect blend of relaxation and adventure.",
    country: "Indonesia",
    location: "Bali",
    images: [
      "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800",
      "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800"
    ],
    activities: ["Beach Relaxation", "Temple Visits", "Rice Terrace Hiking", "Water Sports", "Cultural Tours"],
    bestSeason: "April to October",
    popularAttractions: ["Ubud Sacred Monkey Forest", "Tanah Lot Temple", "Tegallalang Rice Terraces", "Uluwatu Temple", "Nusa Penida"],
    isPopular: true,
    isApproved: true,
    price: 1200,
    rating: 4.8
  },
  {
    name: "Tokyo, Japan",
    description: "A fascinating blend of ultramodern and traditional, offering endless discoveries from ancient temples to cutting-edge technology.",
    country: "Japan",
    location: "Tokyo",
    images: [
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800",
      "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800"
    ],
    activities: ["City Exploration", "Temple Visits", "Shopping", "Food Tours", "Technology Tours"],
    bestSeason: "March to May, September to November",
    popularAttractions: ["Shibuya Crossing", "Senso-ji Temple", "Tokyo Skytree", "Tsukiji Market", "Meiji Shrine"],
    isPopular: true,
    isApproved: true,
    price: 2800,
    rating: 4.7
  },
  {
    name: "Paris, France",
    description: "The City of Light offers iconic landmarks, world-class museums, and unforgettable cuisine in a romantic setting.",
    country: "France",
    location: "Paris",
    images: [
      "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800",
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800",
      "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800"
    ],
    activities: ["Museum Visits", "Eiffel Tower", "Seine River Cruise", "Shopping", "Food Tours"],
    bestSeason: "April to June, September to October",
    popularAttractions: ["Eiffel Tower", "Louvre Museum", "Notre-Dame Cathedral", "Champs-Élysées", "Arc de Triomphe"],
    isPopular: false,
    isApproved: true,
    price: 2500,
    rating: 4.6
  },
  {
    name: "New York, USA",
    description: "The Big Apple offers world-famous attractions, diverse neighborhoods, and endless entertainment options.",
    country: "United States",
    location: "New York",
    images: [
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800",
      "https://images.unsplash.com/photo-1522083165195-3424ed129620?w=800",
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800"
    ],
    activities: ["City Tours", "Broadway Shows", "Shopping", "Museum Visits", "Food Tours"],
    bestSeason: "April to June, September to November",
    popularAttractions: ["Times Square", "Central Park", "Statue of Liberty", "Empire State Building", "Brooklyn Bridge"],
    isPopular: false,
    isApproved: true,
    price: 2200,
    rating: 4.5
  },
  {
    name: "Iceland",
    description: "Land of fire and ice with breathtaking landscapes, geothermal wonders, and the magical Northern Lights.",
    country: "Iceland",
    location: "Reykjavik",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      "https://images.unsplash.com/photo-1539066115647-9f3c5a1a5043?w=800",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"
    ],
    activities: ["Northern Lights Viewing", "Geothermal Baths", "Glacier Hiking", "Waterfall Tours", "Volcano Tours"],
    bestSeason: "June to August, December to March",
    popularAttractions: ["Blue Lagoon", "Golden Circle", "Northern Lights", "Reykjavik", "Vik Black Sand Beach"],
    isPopular: true,
    isApproved: true,
    price: 3500,
    rating: 4.9
  },
  {
    name: "Santorini, Greece",
    description: "Stunning sunsets, white-washed buildings, and crystal-clear waters await in this romantic island paradise.",
    country: "Greece",
    location: "Santorini",
    images: [
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800",
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800",
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800"
    ],
    activities: ["Sunset Viewing", "Beach Relaxation", "Wine Tasting", "Island Tours", "Boat Trips"],
    bestSeason: "June to September",
    popularAttractions: ["Oia Sunset", "Fira Town", "Red Beach", "Wine Tours", "Caldera Views"],
    isPopular: false,
    isApproved: true,
    price: 2000,
    rating: 4.8
  },
  {
    name: "Machu Picchu, Peru",
    description: "Ancient Incan citadel set high in the Andes Mountains, offering breathtaking views and rich history.",
    country: "Peru",
    location: "Cusco",
    images: [
      "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800",
      "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800",
      "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800"
    ],
    activities: ["Inca Trail Hiking", "Archaeological Tours", "Mountain Views", "Cultural Tours", "Photography"],
    bestSeason: "April to October",
    popularAttractions: ["Inca Trail", "Sacred Valley", "Cusco", "Rainbow Mountain", "Machu Picchu Citadel"],
    isPopular: true,
    isApproved: true,
    price: 1800,
    rating: 4.7
  },
  {
    name: "Sydney, Australia",
    description: "Harbor city with iconic Opera House, beautiful beaches, and a vibrant cultural scene.",
    country: "Australia",
    location: "Sydney",
    images: [
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800",
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800",
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800"
    ],
    activities: ["Harbor Tours", "Beach Visits", "Opera House Tours", "Bondi Beach", "City Exploration"],
    bestSeason: "September to November, March to May",
    popularAttractions: ["Sydney Opera House", "Bondi Beach", "Harbor Bridge", "Darling Harbor", "Royal Botanic Garden"],
    isPopular: false,
    isApproved: true,
    price: 2400,
    rating: 4.6
  }
];

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

    // Add admin user reference to all destinations
    const destinationsWithAdmin = sampleDestinations.map(dest => ({
      ...dest,
      addedBy: adminUser._id,
      approvedBy: adminUser._id,
      approvalDate: new Date()
    }));

    // Insert sample destinations
    const insertedDestinations = await Destination.insertMany(destinationsWithAdmin);
    console.log(`✅ Successfully seeded ${insertedDestinations.length} destinations!`);

    console.log('\nSample destinations created:');
    insertedDestinations.forEach(dest => {
      console.log(`- ${dest.name} (${dest.country})`);
    });

  } catch (error) {
    console.error('❌ Error seeding destinations:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seedDestinations(); 
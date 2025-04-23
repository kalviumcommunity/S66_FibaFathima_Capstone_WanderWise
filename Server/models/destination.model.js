const mongoose = require('mongoose');

const DestinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  country: {
    type: String,
  },
  location: {
    type: String,
  },
  images: [
    {
      type: String, 
    },
  ],
  activities: [
    {
      type: String,
    },
  ],
  bestSeason: {
    type: String,
  },
  popularAttractions: [
    {
      type: String,
    },
  ],
  isPopular: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Destination', DestinationSchema);


const mongoose = require('mongoose');

const DestinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
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
  isApproved: {
    type: Boolean,
    default: false,
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvalDate: {
    type: Date
  },
  price: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Destination', DestinationSchema);


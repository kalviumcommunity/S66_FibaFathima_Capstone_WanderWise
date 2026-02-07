const mongoose = require('mongoose')

const TripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  destinationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination' },
  destinationName: String,
  destinationImage: String,
  budget: Number,
  currency: String,
  status: {
    type: String,
    enum: ['upcoming', 'completed', 'cancelled', 'active'],
    default: 'upcoming'
  },
  itinerary: [{
    day: Number,
    activities: [String],
    mapLink: String
  }],
  startDate: Date,
  endDate: Date,
}, { timestamps: true });

module.exports = mongoose.model("Trip", TripSchema)
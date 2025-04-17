const mongoose = require('mongoose');

const ItineraryItemSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true, 
  },
  activity: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,  
  },
  notes: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model('ItineraryItem', ItineraryItemSchema);

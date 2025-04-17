const mongoose = require('mongoose');

const BudgetItemSchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Transportation', 'Accommodation', 'Food', 'Activities', 'Miscellaneous'], // Possible categories
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'USD', // Default currency, but can be changed based on user's location or preferences
  },
  notes: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('BudgetItem', BudgetItemSchema);

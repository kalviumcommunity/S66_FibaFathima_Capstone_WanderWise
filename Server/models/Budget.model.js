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
    enum: ['Transportation', 'Accommodation', 'Food', 'Activities', 'Miscellaneous'], 
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'INR', 
  },
  notes: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('BudgetItem', BudgetItemSchema);

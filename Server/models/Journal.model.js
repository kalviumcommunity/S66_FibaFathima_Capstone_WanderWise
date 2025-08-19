const mongoose = require('mongoose');

const JournalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true
  },
  entries: [
    {
      date: {
        type: Date,
        required: true
      },
      title: {
        type: String,
        required: true
      },
      content: {
        type: String,
        required: true
      },
      mood: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      photos: [
        {
          type: String,
        }
      ]
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Journal', JournalSchema);

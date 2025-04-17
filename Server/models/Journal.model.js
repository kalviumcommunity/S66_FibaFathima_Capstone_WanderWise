const mongoose = require('mongoose')

const JournalEntrySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
    entryDate: Date,
    mood: String,
    content: String,
    images: [String],
  }, { timestamps: true });

  module.exports = mongoose.model("Journal",JournalEntrySchema)
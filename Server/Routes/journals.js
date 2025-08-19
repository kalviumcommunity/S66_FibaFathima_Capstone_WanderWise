const express = require('express');
const router = express.Router();
const Journal = require('../models/Journal.model');
const Trip = require('../models/Trip.model');
const { authenticateToken } = require('../middleware/auth');

// Get journal for a specific trip
router.get('/trip/:tripId', authenticateToken, async (req, res) => {
  try {
    const { tripId } = req.params;
    
    // Verify trip belongs to user
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    
    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Find journal for this trip
    const journal = await Journal.findOne({ tripId, userId: req.user._id })
      .populate('tripId', 'destinationId startDate endDate')
      .populate({
        path: 'tripId',
        populate: {
          path: 'destinationId',
          select: 'name country images'
        }
      });

    if (!journal) {
      return res.status(404).json({ message: 'Journal not found for this trip' });
    }

    res.json(journal);
  } catch (error) {
    console.error('Get journal error:', error);
    res.status(500).json({ message: 'Failed to get journal', error: error.message });
  }
});

// Create journal for a trip
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { tripId } = req.body;

    if (!tripId) {
      return res.status(400).json({ message: 'Trip ID is required' });
    }

    // Verify trip exists and belongs to user
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    
    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if journal already exists
    const existingJournal = await Journal.findOne({ tripId, userId: req.user._id });
    if (existingJournal) {
      return res.status(400).json({ message: 'Journal already exists for this trip' });
    }

    // Create new journal
    const journal = new Journal({
      userId: req.user._id,
      tripId,
      entries: []
    });

    await journal.save();

    // Populate the response
    const populatedJournal = await Journal.findById(journal._id)
      .populate('tripId', 'destinationId startDate endDate')
      .populate({
        path: 'tripId',
        populate: {
          path: 'destinationId',
          select: 'name country images'
        }
      });

    res.status(201).json({
      message: 'Journal created successfully',
      journal: populatedJournal
    });
  } catch (error) {
    console.error('Create journal error:', error);
    res.status(500).json({ message: 'Failed to create journal', error: error.message });
  }
});

// Add entry to journal
router.post('/:id/entries', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { date, title, content, mood, photos } = req.body;

    // Validate required fields
    if (!date || !title || !content || mood === undefined) {
      return res.status(400).json({ 
        message: 'Date, title, content, and mood are required' 
      });
    }

    // Validate mood range
    if (mood < 1 || mood > 5) {
      return res.status(400).json({ 
        message: 'Mood must be between 1 and 5' 
      });
    }

    // Find journal and verify ownership
    const journal = await Journal.findById(id);
    if (!journal) {
      return res.status(404).json({ message: 'Journal not found' });
    }

    if (journal.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Add new entry
    const newEntry = {
      date: new Date(date),
      title,
      content,
      mood,
      photos: photos || []
    };

    journal.entries.push(newEntry);
    await journal.save();

    // Return the newly added entry
    const addedEntry = journal.entries[journal.entries.length - 1];

    res.status(201).json({
      message: 'Entry added successfully',
      entry: addedEntry
    });
  } catch (error) {
    console.error('Add entry error:', error);
    res.status(500).json({ message: 'Failed to add entry', error: error.message });
  }
});

// Update journal entry
router.put('/:id/entries/:entryId', authenticateToken, async (req, res) => {
  try {
    const { id, entryId } = req.params;
    const { date, title, content, mood, photos } = req.body;

    // Find journal and verify ownership
    const journal = await Journal.findById(id);
    if (!journal) {
      return res.status(404).json({ message: 'Journal not found' });
    }

    if (journal.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Find the entry to update
    const entry = journal.entries.id(entryId);
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    // Update entry fields
    if (date) entry.date = new Date(date);
    if (title) entry.title = title;
    if (content) entry.content = content;
    if (mood !== undefined) {
      if (mood < 1 || mood > 5) {
        return res.status(400).json({ 
          message: 'Mood must be between 1 and 5' 
        });
      }
      entry.mood = mood;
    }
    if (photos !== undefined) entry.photos = photos;

    await journal.save();

    res.json({
      message: 'Entry updated successfully',
      entry
    });
  } catch (error) {
    console.error('Update entry error:', error);
    res.status(500).json({ message: 'Failed to update entry', error: error.message });
  }
});

// Delete journal entry
router.delete('/:id/entries/:entryId', authenticateToken, async (req, res) => {
  try {
    const { id, entryId } = req.params;

    // Find journal and verify ownership
    const journal = await Journal.findById(id);
    if (!journal) {
      return res.status(404).json({ message: 'Journal not found' });
    }

    if (journal.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Find and remove the entry
    const entry = journal.entries.id(entryId);
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    journal.entries.pull(entryId);
    await journal.save();

    res.json({
      message: 'Entry deleted successfully'
    });
  } catch (error) {
    console.error('Delete entry error:', error);
    res.status(500).json({ message: 'Failed to delete entry', error: error.message });
  }
});

module.exports = router;

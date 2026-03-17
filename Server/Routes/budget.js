const express = require('express');
const router = express.Router();
const BudgetItem = require('../models/Budget.model');
const Trip = require('../models/Trip.model');
const { authenticateToken } = require('../middleware/auth');

// Get budget for a specific trip
router.get('/trip/:tripId', authenticateToken, async (req, res) => {
  try {
    const { tripId } = req.params;
    
    // Verify trip ownership
    const trip = await Trip.findOne({ _id: tripId, user: req.user._id });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found or access denied' });
    }

    const budgetItems = await BudgetItem.find({ tripId }).sort({ category: 1 });
    
    // Calculate totals by category
    const totals = budgetItems.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
      acc.total = (acc.total || 0) + item.amount;
      return acc;
    }, {});

    res.json({
      items: budgetItems,
      totals,
      currency: budgetItems[0]?.currency || 'INR'
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch budget', error: error.message });
  }
});

// Add budget item
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { tripId, category, amount, currency, notes } = req.body;

    // Verify trip ownership
    const trip = await Trip.findOne({ _id: tripId, user: req.user._id });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found or access denied' });
    }

    const budgetItem = new BudgetItem({
      tripId,
      category,
      amount,
      currency: currency || 'INR',
      notes
    });

    await budgetItem.save();
    res.status(201).json(budgetItem);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add budget item', error: error.message });
  }
});

// Update budget item
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { category, amount, notes } = req.body;

    const budgetItem = await BudgetItem.findById(id);
    if (!budgetItem) {
      return res.status(404).json({ message: 'Budget item not found' });
    }

    // Verify trip ownership
    const trip = await Trip.findOne({ _id: budgetItem.tripId, user: req.user._id });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found or access denied' });
    }

    if (category) budgetItem.category = category;
    if (amount !== undefined) budgetItem.amount = amount;
    if (notes !== undefined) budgetItem.notes = notes;

    await budgetItem.save();
    res.json(budgetItem);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update budget item', error: error.message });
  }
});

// Delete budget item
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const budgetItem = await BudgetItem.findById(id);
    if (!budgetItem) {
      return res.status(404).json({ message: 'Budget item not found' });
    }

    // Verify trip ownership
    const trip = await Trip.findOne({ _id: budgetItem.tripId, user: req.user._id });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found or access denied' });
    }

    await BudgetItem.findByIdAndDelete(id);
    res.json({ message: 'Budget item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete budget item', error: error.message });
  }
});

// Delete all budget items for a trip
router.delete('/trip/:tripId/all', authenticateToken, async (req, res) => {
  try {
    const { tripId } = req.params;

    // Verify trip ownership
    const trip = await Trip.findOne({ _id: tripId, user: req.user._id });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found or access denied' });
    }

    await BudgetItem.deleteMany({ tripId });
    res.json({ message: 'All budget items deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete budget items', error: error.message });
  }
});

module.exports = router;

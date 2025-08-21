const express = require('express');
const router = express.Router();
const Destination = require('../models/destination.model');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Get all approved destinations (public)
router.get('/', async (req, res) => {
  try {
    const { country, search, sort = 'name' } = req.query;
    
    let query = { isApproved: true };
    
    // Filter by country
    if (country) {
      query.country = { $regex: country, $options: 'i' };
    }
    
    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    let sortOption = {};
    if (sort === 'rating') {
      sortOption = { rating: -1 };
    } else if (sort === 'popular') {
      sortOption = { isPopular: -1, rating: -1 };
    } else {
      sortOption = { name: 1 };
    }
    
    const destinations = await Destination.find(query)
      .populate('addedBy', 'username')
      .sort(sortOption);
    
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get destinations', error: error.message });
  }
});

// Get destination by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id)
      .populate('addedBy', 'username')
      .populate('approvedBy', 'username')
      .populate('reviews.user', 'username profilePicture');
    
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    
    res.json(destination);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get destination', error: error.message });
  }
});

// Submit new destination (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, country, location, images, activities, bestSeason, popularAttractions, price } = req.body;
    
    const newDestination = new Destination({
      name,
      description,
      country,
      location,
      images: images || [],
      activities: activities || [],
      bestSeason,
      popularAttractions: popularAttractions || [],
      price: price || 0,
      addedBy: req.user._id,
      isApproved: true, // Always approved since only admins can create
      approvedBy: req.user._id,
      approvalDate: new Date()
    });
    
    await newDestination.save();
    
    const populatedDestination = await Destination.findById(newDestination._id)
      .populate('addedBy', 'username');
    
    res.status(201).json({
      message: 'Destination created successfully by admin',
      destination: populatedDestination
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create destination', error: error.message });
  }
});

// Add review to destination (authenticated users)
router.post('/:id/reviews', authenticateToken, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const destinationId = req.params.id;
    
    const destination = await Destination.findById(destinationId);
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    
    // Check if user already reviewed
    const existingReview = destination.reviews.find(
      review => review.user.toString() === req.user._id.toString()
    );
    
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this destination' });
    }
    
    // Add review
    destination.reviews.push({
      user: req.user._id,
      rating,
      comment
    });
    
    // Update average rating
    const totalRating = destination.reviews.reduce((sum, review) => sum + review.rating, 0);
    destination.rating = totalRating / destination.reviews.length;
    
    await destination.save();
    
    const updatedDestination = await Destination.findById(destinationId)
      .populate('reviews.user', 'username profilePicture');
    
    res.json({
      message: 'Review added successfully',
      destination: updatedDestination
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add review', error: error.message });
  }
});

// Update destination (admin only or original creator)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    
    // Check if user can edit (admin or creator)
    if (req.user.role !== 'admin' && destination.addedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this destination' });
    }
    
    const updatedDestination = await Destination.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('addedBy', 'username');
    
    res.json(updatedDestination);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update destination', error: error.message });
  }
});

// Delete destination (admin only or original creator)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    
    // Check if user can delete (admin or creator)
    if (req.user.role !== 'admin' && destination.addedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this destination' });
    }
    
    await Destination.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Destination deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete destination', error: error.message });
  }
});

// ========== ADMIN ROUTES ==========

// Get all destinations (including pending) - admin only
router.get('/admin/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (status === 'pending') {
      query.isApproved = false;
    } else if (status === 'approved') {
      query.isApproved = true;
    }
    
    const destinations = await Destination.find(query)
      .populate('addedBy', 'username email')
      .populate('approvedBy', 'username')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Destination.countDocuments(query);
    
    res.json({
      destinations,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get destinations', error: error.message });
  }
});

// Approve destination - admin only
router.patch('/admin/:id/approve', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    
    if (destination.isApproved) {
      return res.status(400).json({ message: 'Destination is already approved' });
    }
    
    destination.isApproved = true;
    destination.approvedBy = req.user._id;
    destination.approvalDate = new Date();
    
    await destination.save();
    
    const updatedDestination = await Destination.findById(req.params.id)
      .populate('addedBy', 'username')
      .populate('approvedBy', 'username');
    
    res.json({
      message: 'Destination approved successfully',
      destination: updatedDestination
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to approve destination', error: error.message });
  }
});

// Reject destination - admin only
router.patch('/admin/:id/reject', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { reason } = req.body;
    const destination = await Destination.findById(req.params.id);
    
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    
    await Destination.findByIdAndDelete(req.params.id);
    
    res.json({ 
      message: 'Destination rejected and deleted',
      reason: reason || 'No reason provided'
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reject destination', error: error.message });
  }
});

// Toggle popular status - admin only
router.patch('/admin/:id/toggle-popular', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    
    destination.isPopular = !destination.isPopular;
    await destination.save();
    
    res.json({
      message: `Destination ${destination.isPopular ? 'marked as' : 'removed from'} popular`,
      destination
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle popular status', error: error.message });
  }
});

// Get admin destination stats
router.get('/admin/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const totalDestinations = await Destination.countDocuments();
    const approvedDestinations = await Destination.countDocuments({ isApproved: true });
    const pendingDestinations = await Destination.countDocuments({ isApproved: false });
    const popularDestinations = await Destination.countDocuments({ isPopular: true });
    
    const recentSubmissions = await Destination.find({ isApproved: false })
      .populate('addedBy', 'username email')
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.json({
      totalDestinations,
      approvedDestinations,
      pendingDestinations,
      popularDestinations,
      recentSubmissions
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get destination stats', error: error.message });
  }
});

module.exports = router;

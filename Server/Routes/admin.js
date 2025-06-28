const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const Destination = require('../models/destination.model');
const Trip = require('../models/Trip.model');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// ========== ADMIN DASHBOARD ==========

// Get admin dashboard overview
router.get('/dashboard', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // User statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
    });

    // Destination statistics
    const totalDestinations = await Destination.countDocuments();
    const approvedDestinations = await Destination.countDocuments({ isApproved: true });
    const pendingDestinations = await Destination.countDocuments({ isApproved: false });
    const popularDestinations = await Destination.countDocuments({ isPopular: true });

    // Trip statistics
    const totalTrips = await Trip.countDocuments();
    const activeTrips = await Trip.countDocuments({ status: 'active' });

    // Recent activity
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('username email createdAt role');

    const recentDestinations = await Destination.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('addedBy', 'username')
      .select('name addedBy createdAt isApproved');

    const pendingApprovals = await Destination.find({ isApproved: false })
      .populate('addedBy', 'username email')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      stats: {
        users: {
          total: totalUsers,
          active: activeUsers,
          admins: adminUsers,
          newThisMonth: newUsersThisMonth
        },
        destinations: {
          total: totalDestinations,
          approved: approvedDestinations,
          pending: pendingDestinations,
          popular: popularDestinations
        },
        trips: {
          total: totalTrips,
          active: activeTrips
        }
      },
      recentActivity: {
        users: recentUsers,
        destinations: recentDestinations,
        pendingApprovals
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get dashboard data', error: error.message });
  }
});

// ========== USER MANAGEMENT ==========

// Get all users with pagination and filters
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role, status } = req.query;
    
    let query = {};
    
    // Search filter
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Role filter
    if (role) {
      query.role = role;
    }
    
    // Status filter
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await User.countDocuments(query);
    
    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get users', error: error.message });
  }
});

// Get user details with all related data
router.get('/users/:userId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('savedDestinations')
      .populate('tripHistory')
      .select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get user's submitted destinations
    const submittedDestinations = await Destination.find({ addedBy: req.params.userId })
      .sort({ createdAt: -1 });
    
    // Get user's reviews
    const userReviews = await Destination.find({
      'reviews.user': req.params.userId
    }).populate('reviews.user', 'username');
    
    res.json({
      user,
      submittedDestinations,
      userReviews
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get user details', error: error.message });
  }
});

// Update user role and status
router.patch('/users/:userId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { role, isActive, bio } = req.body;
    
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent admin from deactivating themselves
    if (req.params.userId === req.user._id.toString() && isActive === false) {
      return res.status(400).json({ message: 'Cannot deactivate your own account' });
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { role, isActive, bio },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
});

// Delete user and all their data
router.delete('/users/:userId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent admin from deleting themselves
    if (req.params.userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    
    // Delete user's submitted destinations
    await Destination.deleteMany({ addedBy: req.params.userId });
    
    // Remove user's reviews from destinations
    await Destination.updateMany(
      { 'reviews.user': req.params.userId },
      { $pull: { reviews: { user: req.params.userId } } }
    );
    
    // Delete user
    await User.findByIdAndDelete(req.params.userId);
    
    res.json({ message: 'User and all associated data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
});

// ========== DESTINATION MANAGEMENT ==========

// Get all destinations with filters
router.get('/destinations', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search, country } = req.query;
    
    let query = {};
    
    // Status filter
    if (status === 'pending') {
      query.isApproved = false;
    } else if (status === 'approved') {
      query.isApproved = true;
    }
    
    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Country filter
    if (country) {
      query.country = { $regex: country, $options: 'i' };
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
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get destinations', error: error.message });
  }
});

// Bulk approve destinations
router.post('/destinations/bulk-approve', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { destinationIds } = req.body;
    
    if (!destinationIds || !Array.isArray(destinationIds)) {
      return res.status(400).json({ message: 'Destination IDs array is required' });
    }
    
    const result = await Destination.updateMany(
      { _id: { $in: destinationIds }, isApproved: false },
      { 
        isApproved: true, 
        approvedBy: req.user._id, 
        approvalDate: new Date() 
      }
    );
    
    res.json({
      message: `${result.modifiedCount} destinations approved successfully`,
      approvedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to bulk approve destinations', error: error.message });
  }
});

// Bulk reject destinations
router.post('/destinations/bulk-reject', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { destinationIds, reason } = req.body;
    
    if (!destinationIds || !Array.isArray(destinationIds)) {
      return res.status(400).json({ message: 'Destination IDs array is required' });
    }
    
    const result = await Destination.deleteMany({
      _id: { $in: destinationIds },
      isApproved: false
    });
    
    res.json({
      message: `${result.deletedCount} destinations rejected and deleted`,
      rejectedCount: result.deletedCount,
      reason: reason || 'No reason provided'
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to bulk reject destinations', error: error.message });
  }
});

// ========== ANALYTICS ==========

// Get user analytics
router.get('/analytics/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));
    
    // User registration trend
    const userRegistrations = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    // User activity by role
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Active vs inactive users
    const userStatus = await User.aggregate([
      {
        $group: {
          _id: "$isActive",
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json({
      userRegistrations,
      usersByRole,
      userStatus
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get user analytics', error: error.message });
  }
});

// Get destination analytics
router.get('/analytics/destinations', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { period = '30' } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));
    
    // Destination submission trend
    const destinationSubmissions = await Destination.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    // Destinations by country
    const destinationsByCountry = await Destination.aggregate([
      {
        $group: {
          _id: "$country",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);
    
    // Approval status
    const approvalStatus = await Destination.aggregate([
      {
        $group: {
          _id: "$isApproved",
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Top rated destinations
    const topRatedDestinations = await Destination.find({ rating: { $gt: 0 } })
      .sort({ rating: -1 })
      .limit(10)
      .select('name rating reviews');
    
    res.json({
      destinationSubmissions,
      destinationsByCountry,
      approvalStatus,
      topRatedDestinations
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get destination analytics', error: error.message });
  }
});

module.exports = router; 
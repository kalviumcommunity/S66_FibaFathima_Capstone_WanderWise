const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/user.model');
const { authenticateToken, requireAdmin, requireAdminOrOwner } = require('../middleware/auth');

// Initialize Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register new user
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, bio, profilePicture } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.email === email ? "Email already exists" : "Username already exists" 
      });
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      password,
      bio,
      profilePicture
    });

    await newUser.save();

    // Generate token
    const token = generateToken(newUser._id);

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser,
      token
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(400).json({ message: 'Account is deactivated' });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      message: 'Login successful',
      user,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Google OAuth login
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: 'Google credential is required' });
    }

    // Verify the Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Check if user already exists
    let user = await User.findOne({
      $or: [{ googleId }, { email }]
    });

    if (user) {
      // Update existing user with Google ID if not set
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    } else {
      // Create new user
      user = new User({
        username: name || email.split('@')[0],
        email,
        googleId,
        profilePicture: picture || '',
        // No password for Google OAuth users
      });

      await user.save();
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Google login successful',
      user,
      token
    });

  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ message: 'Google login failed', error: error.message });
  }
});

// Get current user profile (alias for /me)
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('savedDestinations')
      .populate('tripHistory')
      .select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get profile', error: error.message });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('savedDestinations')
      .populate('tripHistory')
      .select('-password');
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get profile', error: error.message });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { username, email, bio, profilePicture } = req.body;
    
    // Check if username or email already exists (excluding current user)
    if (username || email) {
      const existingUser = await User.findOne({
        $or: [
          { username: username || req.user.username },
          { email: email || req.user.email }
        ],
        _id: { $ne: req.user._id }
      });
      
      if (existingUser) {
        return res.status(400).json({ 
          message: existingUser.email === (email || req.user.email) ? "Email already exists" : "Username already exists" 
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { username, email, bio, profilePicture },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
});

// Change password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(currentPassword);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to change password', error: error.message });
  }
});

// Save destination to user's list
router.post('/save-destination/:destinationId', authenticateToken, async (req, res) => {
  try {
    const { destinationId } = req.params;
    
    const user = await User.findById(req.user._id);
    
    if (user.savedDestinations.includes(destinationId)) {
      return res.status(400).json({ message: 'Destination already saved' });
    }

    user.savedDestinations.push(destinationId);
    await user.save();

    res.json({ message: 'Destination saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save destination', error: error.message });
  }
});

// Remove destination from user's list
router.delete('/remove-destination/:destinationId', authenticateToken, async (req, res) => {
  try {
    const { destinationId } = req.params;
    
    const user = await User.findById(req.user._id);
    user.savedDestinations = user.savedDestinations.filter(
      id => id.toString() !== destinationId
    );
    await user.save();

    res.json({ message: 'Destination removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove destination', error: error.message });
  }
});

// Get user's saved destinations
router.get('/saved-destinations', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('savedDestinations')
      .select('savedDestinations');
    
    res.json(user.savedDestinations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get saved destinations', error: error.message });
  }
});

// ========== ADMIN ROUTES ==========

// Get all users (admin only)
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get users', error: error.message });
  }
});

// Get user by ID (admin only)
router.get('/users/:userId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('savedDestinations')
      .populate('tripHistory')
      .select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get user', error: error.message });
  }
});

// Update user (admin only)
router.put('/users/:userId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { username, email, role, isActive, bio } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { username, email, role, isActive, bio },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
});

// Delete user (admin only)
router.delete('/users/:userId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.userId);
    
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
});

// Deactivate/Activate user (admin only)
router.patch('/users/:userId/toggle-status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({ 
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle user status', error: error.message });
  }
});

// Get admin dashboard stats
router.get('/admin/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('username email createdAt');

    res.json({
      totalUsers,
      activeUsers,
      adminUsers,
      recentUsers
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get admin stats', error: error.message });
  }
});

module.exports = router;

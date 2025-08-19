const express = require('express')
const router = express.Router()
const Trip = require('../models/Trip.model')
const User = require('../models/user.model')
const { authenticateToken } = require('../middleware/auth')

//create a new trip
router.post('/', authenticateToken, async(req,res)=>{
    try {
        const { destinationId, itinerary, startDate, endDate } = req.body;

        // Validate required fields
        if (!destinationId) {
            return res.status(400).json({ error: "Destination ID is required" });
        }

        const newTrip = new Trip({
            userId: req.user._id,
            destinationId,
            itinerary: itinerary || [],
            startDate,
            endDate
        });

        const savedTrip = await newTrip.save();

        // Add trip to user's trip history
        await User.findByIdAndUpdate(req.user._id, {
            $push: { tripHistory: savedTrip._id }
        });

        // Populate the response
        const populatedTrip = await Trip.findById(savedTrip._id)
            .populate("userId", "username email")
            .populate("destinationId", "name country images");

        res.status(201).json(populatedTrip);
    } catch (error) {
        res.status(500).json({error:"Failed to create a trip",details:error.message})

    }
})

// Get user's trips (authenticated)
router.get("/", authenticateToken, async (req, res) => {
    try {
      const trips = await Trip.find({ userId: req.user._id })
        .populate("userId", "username email")
        .populate("destinationId", "name country images");
      res.json(trips);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get single trip (authenticated, owner only)
  router.get('/:id', authenticateToken, async (req, res) => {
    try {
      const trip = await Trip.findById(req.params.id)
        .populate("userId", "username email")
        .populate("destinationId", "name country images");

      if (!trip) {
        return res.status(404).json({ message: 'Trip not found' });
      }

      // Check ownership
      if (trip.userId._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }

      res.json(trip);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Update trip (authenticated, owner only)
router.put("/:id", authenticateToken, async(req,res)=>{
    try {
        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        // Check ownership
        if (trip.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const updatedTrip = await Trip.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate("userId", "username email")
         .populate("destinationId", "name country images");

        res.json(updatedTrip)
    } catch (error) {
        res.status(400).json({error:error.message})

    }
})

// Delete trip (authenticated, owner only)
router.delete('/:id', authenticateToken, async(req,res)=>{
    try {
        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        // Check ownership
        if (trip.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }

        await Trip.findByIdAndDelete(req.params.id);

        // Remove from user's trip history
        await User.findByIdAndUpdate(req.user._id, {
            $pull: { tripHistory: req.params.id }
        });

        res.json({message:'Trip deleted successfully'})
    } catch (error) {
        res.status(500).json({error:error.message});

    }
})

module.exports = router;
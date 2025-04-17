const express = require('express');
const router = express.Router();
const Destination = require('../models/destination.model');

// Get all destinations
router.get('/', async (req, res) => {
  try {
    const destinations = await Destination.find();
    res.json(destinations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
    try {
      const {
        name,
        description,
        country, 
        location,
        images,
        activities,
        bestSeason,
        popularAttractions,
        isPopular
      } = req.body;
  
      const newDestination = new Destination({
        name,
        description,
        country,
        location,
        images,
        activities,
        bestSeason,
        popularAttractions,
        isPopular
      });
  
      const savedDestination = await newDestination.save();
      res.status(201).json({
        message: 'Destination added successfully',
        destination: savedDestination
      });
    } catch (error) {
      console.error('Error creating destination:', error);
      res.status(500).json({ message: 'Server error while adding destination' });
    }
  });

//get destination by id
router.get('/:id', async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) return res.status(404).json({ message: 'Destination not found' });
    res.json(destination);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get('/popular', async (req, res) => {
  try {
    const popularDestinations = await Destination.find().limit(6); // 
    res.json(popularDestinations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get('/search', async (req, res) => {
  const query = req.query.query; 
  try {
    const destinations = await Destination.find({ name: { $regex: query, $options: 'i' } });
    res.json(destinations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

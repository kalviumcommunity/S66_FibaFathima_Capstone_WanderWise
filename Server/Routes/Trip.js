const express = require('express')
const router = express.Router()
const Trip = require('../models/Trip.model')

//create a new trip
router.post('/',async(req,res)=>{
    try {
        const newTrip = new Trip(req.body);
        const savedTrip = await newTrip.save();
        res.status(201).json(savedTrip);
    } catch (error) {
        res.status(500).json({error:"Failed to create a trip",details:errpr.message})
        
    }
})

router.get("/", async (req, res) => {
    try {
      const trips = await Trip.find()
        .populate("userId", "username email") 
        .populate("destinationId", "name country");
      res.json(trips);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const trip = await Trip.findById(req.params.id)
        .populate("userId", "username email")
        .populate("destinationId", "name country");
      if (!trip) {
        return res.status(404).json({ message: 'Trip not found' });
      }
      res.json(trip);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

router.put("/:id",async(req,res)=>{
    try {
        const updatedTrip = await Trip.findByIdAndUpdate(req.params.id,req.body,{new:true});
        res.json(updatedTrip)
    } catch (error) {
        res.status(400).json({error:error.message})
        
    }
})

router.delete('/:id',async(req,res)=>{
    try {
        await Trip.findByIdAndDelete(req.params.id);
        res.json({message:'Trip deleted successfully'})
    } catch (error) {
        res.status(500).json({error:error.message});
        
    }
})

module.exports = router;
const express = require('express')
const Router = express.Router()
const Trip = require('../models/Trip.model')

//create a new trip
Router.post('/',async(req,res)=>{
    try {
        const newTrip = new Trip(req.body);
        const savedTrip = await newTrip.save();
        res.status(201).json(savedTrip);
    } catch (error) {
        res.status(500).json({error:"Failed to create a trip",details:errpr.message})
        
    }
})


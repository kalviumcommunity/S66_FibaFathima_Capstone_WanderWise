const express = require('express')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./Routes/Auth')
const destinationRoutes = require('./Routes/destination');
const tripRouter = require('./Routes/Trip')
const connection = require('./db/database');
const { error } = require('console');



dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());



app.get('/', (req, res) => {
  res.json("Welcome to my capstone");
});

app.use('/api/auth', userRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/trips',tripRouter)


app.listen(process.env.PORT, async() => {
  try{
    await connection
    console.log(`Server running on port ${process.env.PORT}`);

  }
  catch(error){
    console.log(error)
  }
  
});
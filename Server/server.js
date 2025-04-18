const express = require('express')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./Routes/Auth')
const destinationRoutes = require('./Routes/destination');
const tripRouter = require('./Routes/Trip')



dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.mongoURL).then(()=>{
    console.log("connected to mongoDB")
}).catch((error)=>{
    console.log(error)
})

app.use('/api/auth', userRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/trips',tripRouter)


app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
const express = require('express')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const destinationRoutes = require('./Routes/destination');



dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.mongoURL).then(()=>{
    console.log("connected to mongoDB")
}).catch((error)=>{
    console.log(error)
})

app.use('/api/auth', require('./Routes/Auth'));
app.use('/api/destinations', destinationRoutes);


app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); 
const User = require('../models/user.model');


// Get all users (admin route)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/sign-in',async(req,res)=>{
  try{
    const {username,email,password,bio,profilePicture} = req.body;
    const existingUser = await User.findOne({email});
    if (existingUser){
      return res.status(400).json({"message":"UserAlready Exists"})
    }
    const hashedPassword = await bcrypt.hash(password,10);

    const newUser = new User({
            username,
            email,
            password: hashedPassword,
            bio,
            profilePicture
          });
          await newUser.save()
          res.status(201).json({message:'User registered successfully',user:newUser})

  }
  catch(error){
    res.status(500).json(error.message)
  }
})


// Get user profile by ID
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/log-in', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User does not exist' });

    // Compare provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });


    res.status(200).json({ message: 'Login successful', token, user });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});


// Get currently logged-in user
router.get('/me', async (req, res) => {
  // This will require JWT authentication middleware, assuming user info is available in the token
  const userId = req.user.id; // Assuming the JWT middleware has set `req.user`
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id',async(req,res)=>{
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new:true}
    );
    if(!updatedUser){
      return res.status(404).json({"message":"user not found"});

    }
    res.json(updatedUser)
    
  } catch (error) {
    res.status(500).json({error:"failed to update user"})
    
  }
})

router.delete("/:id",async(req,res)=>{
  try {
    const deleteduser = await User.findByIdAndDelete(req.params.id);
    if(!deletedUser){
      return res.status(404).json({message:"user not found"})
    }
  } catch (error) {
    res.statusMessage(500).jsom({error:"Failed to delete user"})
  }
})

module.exports = router;

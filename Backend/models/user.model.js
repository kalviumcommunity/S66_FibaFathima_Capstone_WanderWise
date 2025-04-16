const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true

    },
    profilePicture:{
        type:String
    },
    bio: { type: String },

    tripHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trip' }],
    createdAt: { type: Date, default: Date.now },

})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
  });
  
  module.exports = mongoose.model('User', userSchema);
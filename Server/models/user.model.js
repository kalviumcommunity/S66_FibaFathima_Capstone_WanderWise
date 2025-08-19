const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique: true
    },
    email:{
        type:String,
        required:true,
        unique: true
    },
    password:{
        type:String,
        required: function() {
            return !this.googleId; // Password not required if Google OAuth user
        }
    },
    googleId: {
        type: String,
        sparse: true // Allows multiple null values but unique non-null values
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    profilePicture:{
        type:String,
        default: ''
    },
    bio: { 
        type: String,
        default: ''
    },
    savedDestinations: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Destination' 
    }],
    tripHistory: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Trip' 
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    lastLogin: {
        type: Date,
        default: Date.now
    }
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    if (!this.password) return false; // Google OAuth users don't have passwords
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    return user;
};
  
module.exports = mongoose.model('User', userSchema);
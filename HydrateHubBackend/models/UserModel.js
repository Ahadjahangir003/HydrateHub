// UserModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image:{
    type: String,
  },
  address:{
    type: String,
  },
  
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
  },
  verificationPin: {
    type: String,
  },
  verificationPinCreatedAt: {
    type: Date,
  },
  cart: [
    {
      type: Object,
      default: [],
    },
  ],
},  { timestamps: true }
);

userSchema.methods.generateVerificationToken = function () {
  this.verificationToken = crypto.randomBytes(20).toString('hex');
};

const User = mongoose.model('User', userSchema);

module.exports = User;

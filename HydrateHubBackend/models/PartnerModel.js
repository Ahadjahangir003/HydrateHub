const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
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
  cnic: {
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
  location:{
    type: String,
  },
  about:{
    type:String,
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
},  { timestamps: true }
);

partnerSchema.methods.generateVerificationToken = function () {
  this.verificationToken = crypto.randomBytes(20).toString('hex');
};

const Partner = mongoose.model('Partner', partnerSchema);

module.exports = Partner;

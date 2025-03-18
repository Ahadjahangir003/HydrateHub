// models/PackageModel.js
const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  },
  details: {
    type: String,
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  vendor: {
    type: String,
    required: true,
  },
  vendorEmail: {
    type: String,
    required: true,
  }
}, { timestamps: true });

const Package = mongoose.model('Package', packageSchema);

module.exports = Package;

// models/ProductModel.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
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
    required: true,
  },
  details: {
    type: String,
  },
  stock: {
    type: Number,
    default: 0,
    require: true,
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

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

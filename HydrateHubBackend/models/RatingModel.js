// models/RatingModel.js
const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    pId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
    p: {
        type: String,
        required: true,
    },
    review: {
        type: String,
    },

}, { timestamps: true });

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;

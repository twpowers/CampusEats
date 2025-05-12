const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User',       required: true },
    rating:     { type: Number, min: 1, max: 5, required: true },
    comment:    { type: String, trim: true, maxLength: 500 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reviews', reviewSchema);
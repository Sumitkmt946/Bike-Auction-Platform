const mongoose = require('mongoose');

/**
 * Bike Schema
 * Represents a motorcycle listing available for auction.
 */
const bikeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Bike name is required'],
    trim: true,
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true,
  },
  model: {
    type: String,
    required: [true, 'Model is required'],
    trim: true,
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  startingPrice: {
    type: Number,
    required: [true, 'Starting price is required'],
    min: [0, 'Starting price cannot be negative'],
  },
  images: {
    type: [String],
    default: [],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Bike', bikeSchema);

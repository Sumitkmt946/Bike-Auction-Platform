const mongoose = require('mongoose');

/**
 * Bid Schema
 * Represents an individual bid placed on an auction.
 */
const bidSchema = new mongoose.Schema({
  auction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auction',
    required: [true, 'Auction reference is required'],
    index: true,
  },
  bidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Bidder is required'],
  },
  amount: {
    type: Number,
    required: [true, 'Bid amount is required'],
    min: [0, 'Bid amount cannot be negative'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index for efficient querying of bids by auction, sorted by time (newest first)
bidSchema.index({ auction: 1, createdAt: -1 });

module.exports = mongoose.model('Bid', bidSchema);

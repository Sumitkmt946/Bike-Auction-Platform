const mongoose = require('mongoose');

/**
 * Auction Schema
 * Represents a timed auction for a bike listing.
 */
const auctionSchema = new mongoose.Schema({
  bike: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bike',
    required: [true, 'Bike reference is required'],
  },
  startTime: {
    type: Date,
    required: [true, 'Start time is required'],
  },
  endTime: {
    type: Date,
    required: [true, 'End time is required'],
  },
  status: {
    type: String,
    enum: ['upcoming', 'active', 'ended'],
    default: 'upcoming',
  },
  highestBid: {
    type: Number,
    default: 0,
  },
  highestBidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  totalBids: {
    type: Number,
    default: 0,
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

/**
 * Virtual: isActive
 * Returns true if the auction status is 'active' and the current time
 * falls between startTime and endTime.
 */
auctionSchema.virtual('isActive').get(function () {
  const now = new Date();
  return this.status === 'active' && now >= this.startTime && now <= this.endTime;
});

// Ensure virtuals are included when converting to JSON or plain objects
auctionSchema.set('toJSON', { virtuals: true });
auctionSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Auction', auctionSchema);

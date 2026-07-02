const express = require('express');
const router = express.Router({ mergeParams: true });
const { placeBid, getAuctionBids } = require('../controllers/bidController');
const { protect } = require('../middleware/authMiddleware');
const { bidRules, validate } = require('../middleware/validate');

// POST /api/auctions/:auctionId/bids — Place a bid on an auction
router.post('/:auctionId/bids', protect, bidRules, validate, placeBid);

// GET  /api/auctions/:auctionId/bids — Get all bids for an auction
router.get('/:auctionId/bids', protect, getAuctionBids);

module.exports = router;

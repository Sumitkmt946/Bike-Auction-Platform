const express = require('express');
const router = express.Router();
const {
  getAllAuctions,
  getAuctionById,
  createAuction,
  updateAuction,
  deleteAuction,
  startAuction,
  endAuction,
} = require('../controllers/auctionController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const { auctionRules, validate } = require('../middleware/validate');

// GET  /api/auctions     — Get all auctions (supports ?status= filter)
router.get('/', protect, getAllAuctions);

// GET  /api/auctions/:id — Get a single auction by ID
router.get('/:id', protect, getAuctionById);

// POST /api/auctions     — Create a new auction (admin only)
router.post('/', protect, adminOnly, auctionRules, validate, createAuction);

// PUT  /api/auctions/:id — Update an auction (admin only, upcoming only)
router.put('/:id', protect, adminOnly, updateAuction);

// DELETE /api/auctions/:id — Delete an auction (admin only, not active)
router.delete('/:id', protect, adminOnly, deleteAuction);

// PATCH /api/auctions/:id/start — Start an auction (admin only)
router.patch('/:id/start', protect, adminOnly, startAuction);

// PATCH /api/auctions/:id/end   — End an auction (admin only)
router.patch('/:id/end', protect, adminOnly, endAuction);

module.exports = router;

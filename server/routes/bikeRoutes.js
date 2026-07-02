const express = require('express');
const router = express.Router();
const {
  getAllBikes,
  getBikeById,
  createBike,
  updateBike,
  deleteBike,
} = require('../controllers/bikeController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const { bikeRules, validate } = require('../middleware/validate');

// GET  /api/bikes     — Get all bikes (authenticated users)
router.get('/', protect, getAllBikes);

// GET  /api/bikes/:id — Get a single bike by ID
router.get('/:id', protect, getBikeById);

// POST /api/bikes     — Create a new bike (admin only)
router.post('/', protect, adminOnly, bikeRules, validate, createBike);

// PUT  /api/bikes/:id — Update a bike (admin only)
router.put('/:id', protect, adminOnly, updateBike);

// DELETE /api/bikes/:id — Delete a bike (admin only)
router.delete('/:id', protect, adminOnly, deleteBike);

module.exports = router;

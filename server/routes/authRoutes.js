const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { registerRules, loginRules, validate } = require('../middleware/validate');

// POST /api/auth/register — Register a new user
router.post('/register', registerRules, validate, register);

// POST /api/auth/login — Login user
router.post('/login', loginRules, validate, login);

// GET /api/auth/me — Get current authenticated user
router.get('/me', protect, getMe);

module.exports = router;

const express = require('express');
const router = express.Router();
const { login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateLoginInput } = require('../middleware/validation');
const asyncHandler = require('../middleware/asyncHandler');
const { loginLimiter } = require('../middleware/security');

// POST /api/auth/login (with rate limiting)
router.post('/login', loginLimiter, validateLoginInput, asyncHandler(login));

// GET /api/auth/me
router.get('/me', protect, asyncHandler(getMe));

module.exports = router;

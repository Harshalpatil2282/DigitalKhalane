const express = require('express');
const router = express.Router();
const { createRegistration, getRegistrations, exportCSV, deleteRegistration } = require('../controllers/registrationController');
const { protect } = require('../middleware/auth');

// Public
router.post('/', createRegistration);

// Admin
router.get('/', protect, getRegistrations);
router.get('/export', protect, exportCSV);
router.delete('/:id', protect, deleteRegistration);

module.exports = router;

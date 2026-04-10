const express = require('express');
const router = express.Router();
const { createDonation, getDonations, exportDonationsCSV } = require('../controllers/donationController');
const { protect } = require('../middleware/auth');

router.post('/', createDonation);
router.get('/', protect, getDonations);
router.get('/export', protect, exportDonationsCSV);

module.exports = router;

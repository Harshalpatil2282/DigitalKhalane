const express = require('express');
const router = express.Router();
const { submitContact, getContacts, markRead, deleteContact } = require('../controllers/contactController');
const { protect } = require('../middleware/auth');

router.post('/', submitContact);
router.get('/', protect, getContacts);
router.put('/:id/read', protect, markRead);
router.delete('/:id', protect, deleteContact);

module.exports = router;

const express = require('express');
const { checkDuplicates, removeEntry } = require('../controllers/adminController');
const { protect, requireRole } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect, requireRole('Admin'));

router.get('/duplicates', checkDuplicates);
router.delete('/remove/:id', removeEntry);

module.exports = router;

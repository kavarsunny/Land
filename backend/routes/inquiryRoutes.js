const express = require('express');
const {
  createInquiry,
  getInquiries,
  getMyInquiries,
} = require('../controllers/inquiryController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(createInquiry).get(protect, admin, getInquiries);
router.get('/myinquiries', protect, getMyInquiries);

module.exports = router;

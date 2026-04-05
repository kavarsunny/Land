const express = require('express');
const {
  createSurveyRequest,
  getSurveyRequests,
  getMySurveyRequests,
} = require('../controllers/surveyController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(protect, createSurveyRequest).get(protect, admin, getSurveyRequests);
router.get('/myrequests', protect, getMySurveyRequests);

module.exports = router;

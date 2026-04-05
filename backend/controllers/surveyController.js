const SurveyRequest = require('../models/SurveyRequest');

// @desc    Create new survey request
// @route   POST /api/surveys
// @access  Private
const createSurveyRequest = async (req, res) => {
  const { landDetails, ownerName, ownerPhone, notes } = req.body;

  try {
    const survey = new SurveyRequest({
      user: req.user._id,
      landDetails,
      ownerName,
      ownerPhone,
      notes,
    });

    const createdSurvey = await survey.save();
    res.status(201).json(createdSurvey);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all survey requests (admin)
// @route   GET /api/surveys
// @access  Private/Admin
const getSurveyRequests = async (req, res) => {
  try {
    const surveys = await SurveyRequest.find({}).populate('user', 'name email');
    res.json(surveys);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user survey requests
// @route   GET /api/surveys/myrequests
// @access  Private
const getMySurveyRequests = async (req, res) => {
  try {
    const surveys = await SurveyRequest.find({ user: req.user._id });
    res.json(surveys);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSurveyRequest,
  getSurveyRequests,
  getMySurveyRequests,
};

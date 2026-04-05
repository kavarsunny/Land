const Inquiry = require('../models/Inquiry');

// @desc    Create new inquiry
// @route   POST /api/inquiries
// @access  Public
const createInquiry = async (req, res) => {
  const { property, name, email, phone, message } = req.body;

  try {
    const inquiry = new Inquiry({
      property,
      user: req.user ? req.user._id : null,
      name,
      email,
      phone,
      message,
    });

    const createdInquiry = await inquiry.save();
    res.status(201).json(createdInquiry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all inquiries (admin)
// @route   GET /api/inquiries
// @access  Private/Admin
const getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({}).populate('property', 'title price').populate('user', 'name email');
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user inquiries
// @route   GET /api/inquiries/myinquiries
// @access  Private
const getMyInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ user: req.user._id }).populate('property', 'title price');
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createInquiry,
  getInquiries,
  getMyInquiries,
};

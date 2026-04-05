const express = require('express');
const {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getPendingProperties,
  updatePropertyStatus,
} = require('../controllers/propertyController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(getProperties).post(protect, createProperty);
router.route('/admin/pending').get(protect, admin, getPendingProperties);
router.route('/:id/status').put(protect, admin, updatePropertyStatus);

router
  .route('/:id')
  .get(getPropertyById)
  .put(protect, updateProperty)
  .delete(protect, deleteProperty);

module.exports = router;

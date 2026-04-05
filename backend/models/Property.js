const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    city: String,
    state: String,
    address: String,
  },
  size: {
    type: String, // e.g. '2 Acre', '1000 Sqft'
    required: true,
  },
  category: {
    type: String,
    enum: ['Buy', 'Sell', 'Rent', 'NA Land'],
    required: true,
  },
  images: [String], // URLs
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'sold'],
    default: 'active',
  },
  propertyType: {
    type: String, // e.g. Residential, Agricultural, Commercial
  }
}, { timestamps: true });

PropertySchema.index({ 'location.city': 'text', 'location.state': 'text', title: 'text' });

module.exports = mongoose.model('Property', PropertySchema);

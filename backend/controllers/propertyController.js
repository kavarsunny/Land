const Property = require('../models/Property');

// @desc    Get all properties with filtering
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res) => {
  const pageSize = 12;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        $or: [
          { title: { $regex: req.query.keyword, $options: 'i' } },
          { 'location.city': { $regex: req.query.keyword, $options: 'i' } },
          { 'location.state': { $regex: req.query.keyword, $options: 'i' } },
        ],
      }
    : {};

  const category = req.query.category && req.query.category !== 'All' 
    ? { category: req.query.category } 
    : {};

  const minPrice = req.query.minPrice ? { price: { $gte: Number(req.query.minPrice) } } : {};
  const maxPrice = req.query.maxPrice ? { price: { ...minPrice.price, $lte: Number(req.query.maxPrice) } } : minPrice;

  try {
    const query = { ...keyword, ...category, ...maxPrice, status: 'active' }; // Only show approved properties
    const count = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json({ properties, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all pending properties for Admin
// @route   GET /api/properties/admin/pending
// @access  Private/Admin
const getPendingProperties = async (req, res) => {
  try {
    const properties = await Property.find({ status: 'pending' })
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('owner', 'name email');
    if (property) {
      res.json(property);
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a property
// @route   POST /api/properties
// @access  Private
const createProperty = async (req, res) => {
  const { title, description, price, location, size, category, images, propertyType } = req.body;

  try {
    const property = new Property({
      owner: req.user._id,
      title,
      description,
      price,
      location,
      size,
      category,
      images,
      propertyType,
      status: 'pending', // New listings start as pending
    });

    const createdProperty = await property.save();
    res.status(201).json(createdProperty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a property
// @route   PUT /api/properties/:id
// @access  Private/Owner/Admin
const updateProperty = async (req, res) => {
  const { title, description, price, location, size, category, images, propertyType, status } = req.body;

  try {
    const property = await Property.findById(req.params.id);

    if (property) {
      if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(401).json({ message: 'Not authorized to update this property' });
      }

      property.title = title || property.title;
      property.description = description || property.description;
      property.price = price || property.price;
      property.location = location || property.location;
      property.size = size || property.size;
      property.category = category || property.category;
      property.images = images || property.images;
      property.propertyType = propertyType || property.propertyType;
      property.status = status || property.status;

      const updatedProperty = await property.save();
      res.json(updatedProperty);
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a property
// @route   DELETE /api/properties/:id
// @access  Private/Owner/Admin
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (property) {
      if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(401).json({ message: 'Not authorized to delete this property' });
      }

      await Property.deleteOne({ _id: property._id });
      res.json({ message: 'Property removed' });
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify high-quality property
// @route   PUT /api/properties/:id/verify
// @access  Private/Admin
// @desc    Update property status (Approve/Reject)
// @route   PUT /api/properties/:id/status
// @access  Private/Admin
const updatePropertyStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const property = await Property.findById(req.params.id);

    if (property) {
      property.status = status || property.status;
      const updatedProperty = await property.save();
      res.json(updatedProperty);
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getPendingProperties,
  updatePropertyStatus,
};

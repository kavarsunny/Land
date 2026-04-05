const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Property = require('./models/Property');
const Inquiry = require('./models/Inquiry');
const SurveyRequest = require('./models/SurveyRequest');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/swanim-land');

    // Clear existing data
    await User.deleteMany();
    await Property.deleteMany();
    await Inquiry.deleteMany();
    await SurveyRequest.deleteMany();

    // Create Admin
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const admin = await User.create({
      name: 'Swanim Admin',
      email: 'admin@swanim.com',
      password: adminPassword,
      role: 'admin',
    });

    // Create Demo Customer
    const demoPassword = await bcrypt.hash('demo@123', salt);
    const demoUser = await User.create({
      name: 'Demo Customer',
      email: 'demo@swanim.com',
      password: demoPassword,
      role: 'user',
    });

    // Create Properties
    const properties = [
      {
        owner: admin._id,
        title: 'Industrial Land near Mumbai Port',
        description: 'Prime industrial land with 24/7 access to the main port and expressway. Ideal for warehousing, logistics, or large-scale manufacturing.',
        price: 7500000,
        location: { city: 'Mumbai', state: 'Maharashtra', address: 'JNPT Road, Navi Mumbai' },
        size: '5 Acre',
        category: 'NA Land', // Using NA Land for high value
        isVerified: true,
        status: 'active',
        propertyType: 'Commercial',
      },
      {
        owner: demoUser._id,
        title: 'Agricultural Land in Nashik',
        description: 'Fertile land with existing vineyard. Includes water well and electricity. Perfect for grape farming or a farm house project.',
        price: 3500000,
        location: { city: 'Nashik', state: 'Maharashtra', address: 'Sinnar Road' },
        size: '2.5 Acre',
        category: 'Sell',
        isVerified: false,
        status: 'pending',
        propertyType: 'Agricultural',
      },
      {
        owner: demoUser._id,
        title: 'Residential Plot in Pune',
        description: 'Gated community residential plot with all amenities. Located near IT hub Hinjewadi.',
        price: 2500000,
        location: { city: 'Pune', state: 'Maharashtra', address: 'Phase 3, Hinjewadi' },
        size: '2000 Sqft',
        category: 'NA Land',
        isVerified: true,
        status: 'active',
        propertyType: 'Residential',
      },
      {
        owner: demoUser._id,
        title: 'Large Agri Farm near Nagpur',
        description: 'Massive agricultural land suitable for commercial crop cultivation. Clear title, single owner.',
        price: 12000000,
        location: { city: 'Nagpur', state: 'Maharashtra', address: 'Amravati Road' },
        size: '15 Acre',
        category: 'Sell',
        isVerified: false,
        status: 'pending',
        propertyType: 'Agricultural',
      }
    ];

    await Property.insertMany(properties);

    console.log('Database Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

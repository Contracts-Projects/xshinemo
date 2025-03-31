const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/database');
// require('dotenv').config();

// Connect to database
connectDB();

const createAdmin = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    
    if (adminExists) {
      console.log('Admin user already exists');
      process.exit(0);
    }
    
    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: 'admin123', // This will be hashed automatically
      address: 'Admin Address',
      role: 'admin',
      isRegistered: true
    });
    
    console.log('Admin user created successfully');
    console.log(`Email: ${admin.email}`);
    console.log('Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdmin();
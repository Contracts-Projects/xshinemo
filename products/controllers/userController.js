const User = require('../models/User');
const Order = require('../models/Order');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'jwt_secret', {
    expiresIn: '3h'
  });
};

// User Registration
exports.registerUser = asyncHandler(async (req, res) => {
  const { email, password, name, lastName, address } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists'
    });
  }

  // Create new user
  const user = await User.create({
    email,
    password,
    name,
    lastName,
    address,
    isRegistered: true
  });

  // Generate token
  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      lastName: user.lastName
    },
    token
  });
});

// User Login
exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user
  const user = await User.findOne({ email });
  
  // Check if user exists and password is correct
  if (user && (await user.comparePassword(password))) {
    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        lastName: user.lastName
      },
      token: generateToken(user._id)
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }
});

// Get User Profile
exports.getUserProfile = asyncHandler(async (req, res) => {
  // In a real app, this would use authentication middleware
  const user = await User.findById(req.user.id).select('-password');
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.json({
    success: true,
    user
  });
});

// Update User Profile
exports.updateUserProfile = asyncHandler(async (req, res) => {
  const { name, lastName, address } = req.body;

  // In a real app, this would use authentication middleware
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Update fields
  user.name = name || user.name;
  user.lastName = lastName || user.lastName;
  user.address = address || user.address;

  await user.save();

  res.json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      lastName: user.lastName,
      email: user.email
    }
  });
});

// Get User Orders
exports.getUserOrders = asyncHandler(async (req, res) => {
  // In a real app, this would use authentication middleware
  const orders = await Order.find({ user: req.user.id })
    .populate('items.product')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: orders.length,
    orders
  });
});
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// Shipping options
const SHIPPING_OPTIONS = [
  {
    id: 'standard',
    name: 'Standard Shipping',
    price: 5.99,
    estimatedDelivery: '5-7 business days'
  },
  {
    id: 'express',
    name: 'Express Shipping',
    price: 12.99,
    estimatedDelivery: '2-3 business days'
  },
  {
    id: 'overnight',
    name: 'Overnight Shipping',
    price: 19.99,
    estimatedDelivery: 'Next business day'
  }
];

// Get available shipping options
exports.getShippingOptions = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    shippingOptions: SHIPPING_OPTIONS
  });
});

// Validate checkout details
exports.validateCheckout = asyncHandler(async (req, res) => {
  const { 
    email, 
    name, 
    lastName, 
    shippingAddress,
    items 
  } = req.body;

  const errors = {};

  // Validate email
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    errors.email = 'Valid email is required';
  }

  // Validate name
  if (!name || name.trim().length < 2) {
    errors.name = 'Name is required';
  }

  // Validate last name
  if (!lastName || lastName.trim().length < 2) {
    errors.lastName = 'Last name is required';
  }

  // Validate shipping address
  if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
    errors.shippingAddress = 'Complete shipping address is required';
  }

  // Validate cart items
  if (!items || items.length === 0) {
    errors.items = 'Cart is empty';
  }

  // Check product availability
  if (items) {
    for (let item of items) {
      const product = await Product.findById(item.productId);
      if (!product || product.stockQuantity < item.quantity) {
        errors.productAvailability = `Insufficient stock for product: ${item.productId}`;
        break;
      }
    }
  }

  // Respond with validation results
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      errors
    });
  }

  res.json({
    success: true,
    message: 'Checkout details are valid'
  });
});

// Process checkout
exports.processCheckout = asyncHandler(async (req, res) => {
  const { 
    email, 
    name, 
    lastName, 
    shippingAddress, 
    shippingOption, 
    items,
    register,
    password
  } = req.body;

  // Find or create user
  let user = await User.findOne({ email });

  if (!user) {
    // Create new user if registration is requested
    if (register) {
      user = new User({
        email,
        password,
        name,
        lastName,
        address: `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}`,
        isRegistered: true
      });
      await user.save();
    } else {
      // Create guest user
      user = new User({
        email,
        name,
        lastName,
        address: `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}`,
        isRegistered: false
      });
      await user.save();
    }
  }

  // Calculate total amount
  const orderItems = await Promise.all(items.map(async (item) => {
    const product = await Product.findById(item.productId);
    
    // Reduce stock
    product.stockQuantity -= item.quantity;
    await product.save();

    return {
      product: item.productId,
      quantity: item.quantity,
      price: product.price
    };
  }));

  // Calculate total with shipping
  const shippingPrice = SHIPPING_OPTIONS.find(
    option => option.id === shippingOption
  )?.price || 0;

  const totalAmount = orderItems.reduce(
    (total, item) => total + (item.price * item.quantity), 
    shippingPrice
  );

  // Create order
  const order = new Order({
    user: user._id,
    items: orderItems,
    totalAmount,
    shippingOption,
    shippingAddress,
    orderStatus: 'pending',
    paymentStatus: 'pending'
  });

  await order.save();

  // Add order to user's order history
  user.orders.push(order._id);
  await user.save();

  res.status(201).json({
    success: true,
    message: 'Order processed successfully',
    orderId: order._id,
    totalAmount
  });
});
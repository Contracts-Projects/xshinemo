const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');

// Simulate cart storage (in a real app, use session or database)
const cartStorage = new Map();

// Get cart contents
exports.getCart = asyncHandler(async (req, res) => {
  // In a real app, you'd use user ID from authentication
  const sessionId = req.headers['x-session-id'] || 'guest';
  
  const cart = cartStorage.get(sessionId) || [];
  
  // Calculate total
  const cartWithDetails = await Promise.all(cart.map(async (item) => {
    const product = await Product.findById(item.productId);
    return {
      ...item,
      productName: product.name,
      productPrice: product.price,
      total: product.price * item.quantity
    };
  }));
  
  const totalAmount = cartWithDetails.reduce((sum, item) => sum + item.total, 0);
  
  res.json({
    success: true,
    items: cartWithDetails,
    totalAmount
  });
});

// Add item to cart
exports.addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const sessionId = req.headers['x-session-id'] || 'guest';
  
  // Validate product
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }
  
  // Get current cart or initialize
  const cart = cartStorage.get(sessionId) || [];
  
  // Check if product already in cart
  const existingItemIndex = cart.findIndex(item => item.productId === productId);
  
  if (existingItemIndex > -1) {
    // Update quantity if product exists
    cart[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    cart.push({ productId, quantity });
  }
  
  // Save updated cart
  cartStorage.set(sessionId, cart);
  
  res.status(201).json({
    success: true,
    message: 'Item added to cart',
    cart
  });
});

// Update cart item quantity
exports.updateCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const sessionId = req.headers['x-session-id'] || 'guest';
  
  // Get current cart
  const cart = cartStorage.get(sessionId) || [];
  
  // Find and update item
  const updatedCart = cart.map(item => 
    item.productId === productId 
      ? { ...item, quantity: Math.max(1, quantity) } 
      : item
  );
  
  // Save updated cart
  cartStorage.set(sessionId, updatedCart);
  
  res.json({
    success: true,
    message: 'Cart updated',
    cart: updatedCart
  });
});

// Remove item from cart
exports.removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const sessionId = req.headers['x-session-id'] || 'guest';
  
  // Get current cart
  const cart = cartStorage.get(sessionId) || [];
  
  // Remove item
  const updatedCart = cart.filter(item => item.productId !== productId);
  
  // Save updated cart
  cartStorage.set(sessionId, updatedCart);
  
  res.json({
    success: true,
    message: 'Item removed from cart',
    cart: updatedCart
  });
});

// Clear entire cart
exports.clearCart = asyncHandler(async (req, res) => {
  const sessionId = req.headers['x-session-id'] || 'guest';
  
  // Clear cart
  cartStorage.delete(sessionId);
  
  res.json({
    success: true,
    message: 'Cart cleared'
  });
});
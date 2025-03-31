const express = require('express');
const router = express.Router();
const { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart 
} = require('../controllers/cartController');

// GET current cart
router.get('/', getCart);

// ADD item to cart
router.post('/add', addToCart);

// UPDATE cart item quantity
router.put('/update/:productId', updateCartItem);

// REMOVE item from cart
router.delete('/remove/:productId', removeFromCart);

// CLEAR entire cart
router.delete('/clear', clearCart);

module.exports = router;
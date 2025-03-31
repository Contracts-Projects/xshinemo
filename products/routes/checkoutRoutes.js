const express = require('express');
const router = express.Router();
const { 
  processCheckout, 
  getShippingOptions,
  validateCheckout
} = require('../controllers/checkoutController');

// GET available shipping options
router.get('/shipping-options', getShippingOptions);

// Validate checkout details
router.post('/validate', validateCheckout);

// Process checkout
router.post('/', processCheckout);

module.exports = router;
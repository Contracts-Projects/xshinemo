const express = require('express');
const router = express.Router();
const { 
  getAllProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// GET all products
router.get('/', getAllProducts);

// GET single product by ID
router.get('/:id', getProductById);

// CREATE new product
router.post('/', protect, adminOnly, createProduct);

// UPDATE product
router.put('/:id', protect, adminOnly, updateProduct);

// DELETE product
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
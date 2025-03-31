const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Product name is required'],
    trim: true
  },
  description: { 
    type: String, 
    required: [true, 'Product description is required'] 
  },
  price: { 
    type: Number, 
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  imageUrl: { 
    type: String 
  },
  category: { 
    type: String,
    enum: ['Household', 'Kitchen', 'Bathroom', 'Laundry', 'Specialized']
  },
  inStock: { 
    type: Boolean, 
    default: true 
  },
  stockQuantity: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
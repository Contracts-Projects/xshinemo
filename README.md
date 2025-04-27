# xshinemo
Re-building a project and enhancing UI/UX and functionality.

# Cleaning Products E-commerce Backend

A comprehensive Node.js/Express backend application for an e-commerce store that sells cleaning products.

## Features

- **Product Management**: Create, read, update and delete cleaning products
- **Shopping Cart**: Full cart functionality with session-based storage
- **User Management**: Optional registration system with secure authentication
- **Checkout Process**: Complete checkout flow with shipping options
- **Order Management**: Process and track orders

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Database Structure](#database-structure)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

## Requirements

- Node.js 14.x or higher
- MongoDB 4.x or higher
- NPM or Yarn package manager

## Installation

1. Clone the repository:
   ```bash
   git clone <https://github.com/Contracts-Projects/xshinemo>
   cd cleaning-products-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/cleaning_products_db
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   ```

4. Start the server:
   ```bash
   npm start
   ```

## Configuration

The application uses various configuration settings that can be modified:

- **Database Connection**: MongoDB connection settings in `config/database.js`
- **Server Configuration**: Port settings in `server.js`
- **JWT Authentication**: Secret key and expiration in environment variables

## API Endpoints

### Products

- `GET https://xshinemo.onrender.com/api/products` - Get all products
- `GET https://xshinemo.onrender.com/api/products/:id` - Get a single product
- `POST https://xshinemo.onrender.com/api/products` - Create a new product
- `PUT https://xshinemo.onrender.com/api/products/:id` - Update a product
- `DELETE https://xshinemo.onrender.com/api/products/:id` - Delete a product

### Cart

- `GET https://xshinemo.onrender.com/api/cart` - Get cart contents
- `POST https://xshinemo.onrender.com/api/cart/add` - Add item to cart
- `PUT https://xshinemo.onrender.com/api/cart/update/:productId` - Update cart item quantity
- `DELETE https://xshinemo.onrender.com/api/cart/remove/:productId` - Remove item from cart
- `DELETE https://xshinemo.onrender.com/api/cart/clear` - Clear entire cart

### Checkout

- `GET https://xshinemo.onrender.com/api/checkout/shipping-options` - Get shipping options
- `POST https://xshinemo.onrender.com/api/checkout/validate` - Validate checkout details
- `POST https://xshinemo.onrender.com/api/checkout` - Process checkout

### Users

- `POST https://xshinemo.onrender.com/api/users/register` - Register a new user
- `POST https://xshinemo.onrender.com/api/users/login` - Login user
- `GET https://xshinemo.onrender.com/api/users/profile` - Get user profile
- `PUT https://xshinemo.onrender.com/api/users/profile` - Update user profile
- `GET https://xshinemo.onrender.com/api/users/orders` - Get user orders

## Database Structure

### Collections

1. **Products**
   - name: String
   - description: String
   - price: Number
   - imageUrl: String
   - category: String
   - inStock: Boolean
   - stockQuantity: Number

2. **Users**
   - email: String
   - password: String (hashed)
   - name: String
   - lastName: String
   - address: String
   - isRegistered: Boolean
   - orders: Array of Order IDs

3. **Orders**
   - user: User ID reference
   - items: Array of product references with quantities
   - totalAmount: Number
   - shippingOption: String
   - shippingAddress: Object
   - orderStatus: String
   - paymentStatus: String

## Future Enhancements

### Payment Integration

The system is designed to easily integrate with payment gateways. Future plans include:

- Integration with Stripe, PayPal, or other payment processors
- Secure handling of payment information
- Order status updates based on payment status
- Invoice generation


## //   NOT YET IMPLEMENTED   //
### Implementation Steps for Payment Integration

1. Install necessary payment gateway SDK:
   ```bash
   npm install stripe
   ```

2. Create payment controller and routes
3. Update the checkout process to handle payment processing
4. Implement webhook handlers for payment status updates
5. Add payment verification and receipt generation

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License.

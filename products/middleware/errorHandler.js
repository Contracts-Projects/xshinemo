const errorHandler = (err, req, res, next) => {
    // Log error for server-side tracking
    console.error(err);
  
    // Determine status code
    const statusCode = err.statusCode || 500;
    
    // Prepare error response
    const errorResponse = {
      success: false,
      status: statusCode,
      message: err.message || 'Internal Server Error',
      // Include stack trace in development
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    };
  
    // Handle specific mongoose validation errors
    if (err.name === 'ValidationError') {
      errorResponse.errors = Object.values(err.errors).map(error => error.message);
    }
  
    // Handle duplicate key errors
    if (err.code === 11000) {
      errorResponse.message = 'Duplicate key error';
      errorResponse.duplicateFields = Object.keys(err.keyValue);
    }
  
    // Send error response
    res.status(statusCode).json(errorResponse);
  };
  
  module.exports = errorHandler;
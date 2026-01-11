const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded. User ID:', decoded.id);

      // Get user from token
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        console.error('User not found for ID:', decoded.id);
        return res.status(401).json({
          success: false,
          error: 'User not found'
        });
      }

      console.log('User found and attached:', user._id);
      req.user = user;
      return next(); // Use return to exit function
      
    } catch (error) {
      console.error('Token verification error:', error.message);
      return res.status(401).json({
        success: false,
        error: 'Not authorized, invalid token'
      });
    }
  }

  // No token provided
  console.error('No authorization token provided');
  return res.status(401).json({
    success: false,
    error: 'Not authorized, no token provided'
  });
};

module.exports = { protect };
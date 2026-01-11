const { check, validationResult } = require('express-validator');

// Validation rules for user registration
const validateRegister = [
  check('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters'),
  
  check('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  check('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  
  check('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
];

// Validation rules for user login
const validateLogin = [
  check('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  
  check('password')
    .notEmpty().withMessage('Password is required')
];

const validateTaskCreate = [
  check('title')
    .trim()
    .notEmpty().withMessage('Task title is required')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  
  check('description')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  
  check('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status'),
  
  check('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  
  check('dueDate')
    .optional()
    .isISO8601().withMessage('Invalid date format')
    .custom(value => {
      if (value && new Date(value) < new Date()) {
        throw new Error('Due date cannot be in the past');
      }
      return true;
    })
];


const validateTaskUpdate = [
  check('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Task title cannot be empty')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  
  check('description')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  
  check('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status'),
  
  check('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  
  check('dueDate')
    .optional()
    .isISO8601().withMessage('Invalid date format')
];

const validate = (req, res, next) => {
  console.log('=== VALIDATION MIDDLEWARE ===');
  console.log('Original body:', req.body);
  

  const originalBody = { ...req.body };
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  

  req.body = {
    ...req.body, // Validated fields
    ...originalBody // Restore all original fields
  };
  
  console.log('Body after validation restore:', req.body);
  console.log('Validation passed ✓');
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateTaskCreate,
  validateTaskUpdate,
  validate
};
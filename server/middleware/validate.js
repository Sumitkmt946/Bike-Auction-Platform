const { body, validationResult } = require('express-validator');

/**
 * Validation rules for user registration.
 */
const registerRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

/**
 * Validation rules for user login.
 */
const loginRules = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

/**
 * Validation rules for creating/updating a bike.
 */
const bikeRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Bike name is required'),
  body('brand')
    .trim()
    .notEmpty()
    .withMessage('Brand is required'),
  body('model')
    .trim()
    .notEmpty()
    .withMessage('Model is required'),
  body('year')
    .isNumeric()
    .withMessage('Year must be a number')
    .isInt({ min: 1900, max: 2100 })
    .withMessage('Year must be between 1900 and 2100'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),
  body('startingPrice')
    .isNumeric()
    .withMessage('Starting price must be a number')
    .isFloat({ min: 0 })
    .withMessage('Starting price cannot be negative'),
];

/**
 * Validation rules for creating an auction.
 */
const auctionRules = [
  body('bike')
    .isMongoId()
    .withMessage('Valid bike ID is required'),
  body('startTime')
    .isISO8601()
    .withMessage('Start time must be a valid ISO 8601 date'),
  body('endTime')
    .isISO8601()
    .withMessage('End time must be a valid ISO 8601 date'),
];

/**
 * Validation rules for placing a bid.
 */
const bidRules = [
  body('amount')
    .isNumeric()
    .withMessage('Bid amount must be a number')
    .isFloat({ min: 1 })
    .withMessage('Bid amount must be at least 1'),
];

/**
 * Middleware: Checks the results of express-validator rules.
 * If validation errors exist, returns 400 with the error details.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }

  next();
};

module.exports = {
  registerRules,
  loginRules,
  bikeRules,
  auctionRules,
  bidRules,
  validate,
};

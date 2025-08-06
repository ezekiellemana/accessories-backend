const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { body, validationResult } = require('express-validator');

const validate = (validations) => async (req, res, next) => {
  await Promise.all(validations.map((v) => v.run(req)));
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  res.status(400).json({ errors: errors.array() });
};

// Register route with validation
router.post(
  '/register',
  validate([
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
  ]),
  register
);

// Login route with validation
router.post(
  '/login',
  validate([
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password is required'),
  ]),
  login
);

module.exports = router;

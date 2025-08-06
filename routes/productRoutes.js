const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const mongoose = require('mongoose');

const {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const { protect, adminOnly } = require('../middleware/authMiddleware');

const validate = (validations) => async (req, res, next) => {
  await Promise.all(validations.map((v) => v.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

// Public route
router.get('/', getAllProducts);

// Admin routes
router.post(
  '/',
  protect,
  adminOnly,
  validate([
    body('name').notEmpty().withMessage('Name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than zero'),
    body('category').custom(isValidObjectId).withMessage('Invalid category ID'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be zero or greater'),
    body('image').optional().isURL().withMessage('Image must be a valid URL'),
  ]),
  createProduct
);

router.put(
  '/:id',
  protect,
  adminOnly,
  validate([
    param('id').custom(isValidObjectId).withMessage('Invalid product ID'),
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
    body('price').optional().isFloat({ gt: 0 }).withMessage('Price must be greater than zero'),
    body('category').optional().custom(isValidObjectId).withMessage('Invalid category ID'),
    body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be zero or greater'),
    body('image').optional().isURL().withMessage('Image must be a valid URL'),
  ]),
  updateProduct
);

router.delete(
  '/:id',
  protect,
  adminOnly,
  validate([param('id').custom(isValidObjectId).withMessage('Invalid product ID')]),
  deleteProduct
);

module.exports = router;

const express = require('express');
const { body, param } = require('express-validator');
const mongoose = require('mongoose');
const { createProduct, getAllProducts, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');
const catchAsync = require('../middleware/catchAsync');

const router = express.Router();
const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

// Public
router.get('/', catchAsync(getAllProducts));

// Admin only
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
  catchAsync(createProduct)
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
  catchAsync(updateProduct)
);

router.delete(
  '/:id',
  protect,
  adminOnly,
  validate([
    param('id').custom(isValidObjectId).withMessage('Invalid product ID'),
  ]),
  catchAsync(deleteProduct)
);

module.exports = router;

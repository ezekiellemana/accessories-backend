const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const mongoose = require('mongoose');

const {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');

const { protect, adminOnly } = require('../middleware/auth');

const validate = (validations) => async (req, res, next) => {
  await Promise.all(validations.map(v => v.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validate ObjectId helper
const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

// Customer routes
router.post(
  '/',
  protect,
  validate([
    body('products').isArray({ min: 1 }).withMessage('Products array is required'),
    body('deliveryInfo.address').notEmpty().withMessage('Delivery address required'),
    body('deliveryInfo.phone').notEmpty().withMessage('Delivery phone required'),
    body('paymentMethod').isIn(['cash', 'mobile_money']).withMessage('Invalid payment method'),
  ]),
  placeOrder
);

router.get('/my-orders', protect, getMyOrders);

// Admin routes
router.get('/', protect, adminOnly, getAllOrders);

router.put(
  '/:id/status',
  protect,
  adminOnly,
  validate([
    param('id').custom(isValidObjectId).withMessage('Invalid order ID'),
    body('status').isIn(['pending', 'approved', 'shipped', 'delivered']).withMessage('Invalid status'),
  ]),
  updateOrderStatus
);

module.exports = router;

const express = require('express');
const { body, param } = require('express-validator');
const mongoose = require('mongoose');
const { placeOrder, getMyOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');
const catchAsync = require('../middleware/catchAsync');

const router = express.Router();
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
  catchAsync(placeOrder)
);

router.get('/my-orders', protect, catchAsync(getMyOrders));

// Admin routes
router.get('/', protect, adminOnly, catchAsync(getAllOrders));

router.put(
  '/:id/status',
  protect,
  adminOnly,
  validate([
    param('id').custom(isValidObjectId).withMessage('Invalid order ID'),
    body('status').isIn(['pending', 'approved', 'shipped', 'delivered']).withMessage('Invalid status'),
  ]),
  catchAsync(updateOrderStatus)
);

module.exports = router;

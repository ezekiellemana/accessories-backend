const Order = require('../models/Order');

// @desc Place new order
exports.placeOrder = async (req, res) => {
  try {
    const { products, deliveryInfo, paymentMethod } = req.body;

    const newOrder = await Order.create({
      userId: req.user.id,
      products,
      deliveryInfo,
      paymentMethod
    });

    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc Get customer's orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate('products.productId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc Admin: get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('userId').populate('products.productId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc Admin: update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

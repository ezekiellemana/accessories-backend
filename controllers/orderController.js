const Order = require("../models/Order");
const User = require("../models/User");
const { sendEmail } = require("../utils/sendEmail"); // Adjust path accordingly

const validStatuses = ['pending', 'approved', 'shipped', 'delivered'];

exports.placeOrder = async (req, res, next) => {
  try {
    const { products, deliveryInfo, paymentMethod } = req.body;

    // Basic validation (expand as needed)
    if (!products || products.length === 0) {
      return res.status(400).json({ message: 'Order must include at least one product' });
    }
    if (!deliveryInfo?.address || !deliveryInfo?.phone) {
      return res.status(400).json({ message: 'Delivery address and phone required' });
    }
    if (!['cash', 'mobile_money'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'Invalid payment method' });
    }

    const newOrder = await Order.create({
      userId: req.user.id,
      products,
      deliveryInfo,
      paymentMethod,
    });

    const user = await User.findById(req.user.id);
    if (user) {
      const emailHTML = `
        <h2>Order Confirmation</h2>
        <p>Hi ${user.name},</p>
        <p>Your order has been placed successfully.</p>
        <p>Status: <strong>${newOrder.status}</strong></p>
        <p>We'll notify you when it's shipped!</p>
        <br/>
        <p>Thank you for shopping with us ✌️</p>
      `;

      await sendEmail(user.email, "Order Confirmation", emailHTML);
    }

    res.status(201).json({ success: true, data: newOrder });
  } catch (err) {
    next(err);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate("products.productId");
    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email") // limit fields to reduce payload
      .populate("products.productId");
    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      message: "Order status updated successfully",
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

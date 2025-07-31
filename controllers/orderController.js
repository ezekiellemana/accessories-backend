const Order = require("../models/Order");

// @desc Place new order
exports.placeOrder = async (req, res) => {
  try {
    const { products, deliveryInfo, paymentMethod } = req.body;

    const newOrder = await Order.create({
      userId: req.user.id,
      products,
      deliveryInfo,
      paymentMethod,
    });

    // Fetch user email
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

    res.status(201).json(newOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Get customer's orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate(
      "products.productId"
    );
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Admin: get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId")
      .populate("products.productId");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Admin: update order status
// Update order status (admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

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
      order,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

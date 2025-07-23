const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      quantity: Number
    }
  ],

  deliveryInfo: {
    address: String,
    phone: String
  },

  paymentMethod: {
    type: String,
    enum: ['cash', 'mobile_money'],
    required: true
  },

  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Shipped', 'Delivered'],
    default: 'Pending'
  }

}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);

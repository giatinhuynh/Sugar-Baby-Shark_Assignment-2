// models/Order.js

const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }],
  shipper: { type: mongoose.Schema.Types.ObjectId, ref: 'Shipper' },
  status: { type: String, enum: ['active', 'delivered', 'canceled'], default: 'active' },
  totalAmount: { type: Number, required: true },
});

module.exports = mongoose.model('Order', OrderSchema);

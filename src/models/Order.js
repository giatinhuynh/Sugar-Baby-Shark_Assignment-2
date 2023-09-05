// models/Order.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrderSchema = new Schema({
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  distributionHubId: { type: Schema.Types.ObjectId, ref: 'DistributionHub', required: true },
  shipperId: { type: Schema.Types.ObjectId, ref: 'Shipper' },
  products: [{ 
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true }
  }],
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['active', 'delivered', 'canceled'], default: 'active' }
});

module.exports = mongoose.model('Order', OrderSchema);

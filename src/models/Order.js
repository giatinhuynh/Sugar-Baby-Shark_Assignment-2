/* // RMIT University Vietnam
// Course: COSC2430 Web Programming
// Semester: 2023B
// Assessment: Assignment 2
// Author: Huynh Duc Gia Tin, Tran Ha Phuong, Nguyen Viet Ha, Phan Nhat Minh, Tran Nguyen Quoc An
// ID: s3962053, s3979638, s3978128, s3959931, s3978598 
// Acknowledgement: MDN Web Docs, Youtube, W3school, GeeksforGeeks, RMIT Canvas, ChatGPT, NPM Packages' Docs */

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

module.exports = mongoose.model('Order', OrderSchema,'orders');



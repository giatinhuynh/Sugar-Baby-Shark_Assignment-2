// models/Product.js

const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  description: { type: String },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
});

module.exports = mongoose.model('Product', ProductSchema);

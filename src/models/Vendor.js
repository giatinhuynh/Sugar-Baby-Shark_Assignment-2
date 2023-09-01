// models/Vendor.js

const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  profilePicture: { type: String },
  businessName: { type: String, unique: true, required: true },
  businessAddress: { type: String, unique: true, required: true },
});

module.exports = mongoose.model('Vendor', VendorSchema);

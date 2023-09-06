// models/Vendor.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;

const VendorSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    minlength: 8,
    maxlength: 15,
    match: /^[A-Za-z0-9]+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 20
  },
  profilePicture: String,
  businessName: {
    type: String,
    unique: true,
    required: true,
    minlength: 5
  },
  businessAddress: {
    type: String,
    unique: true,
    required: true,
    minlength: 5
  }
});

VendorSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

module.exports = mongoose.model('Vendor', VendorSchema);

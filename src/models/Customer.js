// models/Customer.js

const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  profilePicture: { type: String },
  name: { type: String, required: true },
  address: { type: String, required: true },
});

module.exports = mongoose.model('Customer', CustomerSchema);

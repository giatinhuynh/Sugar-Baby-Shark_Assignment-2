// models/Shipper.js

const mongoose = require('mongoose');

const ShipperSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  profilePicture: { type: String },
  assignedHub: { type: mongoose.Schema.Types.ObjectId, ref: 'DistributionHub', required: true },
});

module.exports = mongoose.model('Shipper', ShipperSchema);

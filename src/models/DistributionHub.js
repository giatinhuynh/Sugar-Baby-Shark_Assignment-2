// models/DistributionHub.js

const mongoose = require('mongoose');

const DistributionHubSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  address: { type: String, unique: true, required: true },
});

module.exports = mongoose.model('DistributionHub', DistributionHubSchema);

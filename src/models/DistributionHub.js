// models/DistributionHub.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const DistributionHubSchema = new Schema({
  name: { type: String, unique: true, required: true },
  address: { type: String, unique: true, required: true }
});

module.exports = mongoose.model('DistributionHub', DistributionHubSchema);

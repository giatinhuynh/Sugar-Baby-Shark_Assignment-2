// models/DistributionHub.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const DistributionHubSchema = new Schema({
  name: { 
    type: String, 
    unique: true, 
    required: true,
    minlength: 5  
  },
  address: { 
    type: String, 
    unique: true, 
    required: true,
    minlength: 5 
  }
});

module.exports = mongoose.model('DistributionHub', DistributionHubSchema);

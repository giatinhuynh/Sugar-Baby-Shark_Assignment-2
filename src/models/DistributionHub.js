/* // RMIT University Vietnam
// Course: COSC2430 Web Programming
// Semester: 2023B
// Assessment: Assignment 2
// Author: Huynh Duc Gia Tin, Tran Ha Phuong, Nguyen Viet Ha, Phan Nhat Minh, Tran Nguyen Quoc An
// ID: s3962053, s3979638, s3978128, s3959931, s3978598 
// Acknowledgement: MDN Web Docs, Youtube, W3school, GeeksforGeeks, RMIT Canvas, ChatGPT, NPM Packages' Docs */

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

module.exports = mongoose.model('DistributionHub', DistributionHubSchema,'distributionHubs');

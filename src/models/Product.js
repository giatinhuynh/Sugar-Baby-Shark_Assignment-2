/* // RMIT University Vietnam
// Course: COSC2430 Web Programming
// Semester: 2023B
// Assessment: Assignment 2
// Author: Huynh Duc Gia Tin, Tran Ha Phuong, Nguyen Viet Ha, Phan Nhat Minh, Tran Nguyen Quoc An
// ID: s3962053, s3979638, s3978128, s3959931, s3978598 
// Acknowledgement: MDN Web Docs, Youtube, W3school, GeeksforGeeks, RMIT Canvas, ChatGPT, NPM Packages' Docs */

// models/Product.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 20
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: String,
  description: {
    type: String,
    maxlength: 500
  },
  vendor: {
    type: Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  category:{
    type: String,
    required: true,
    enum: ['KITCHEN', 'BEDROOM', 'LIVINGROOM', 'BATHROOM', 'OTHERS'],
  },
  
});


module.exports = mongoose.model('Product', ProductSchema,'products');

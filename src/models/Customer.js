// models/Customer.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;

const customerSchema = new Schema({
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
  profilePicture: {
    type: Buffer,
  },
  profilePictureType: {
    type: String,
  },
  name: {
    type: String,
    required: true,
    minlength: 5
  },
  gender: {
    type: String, 
    required: true,
    enum: ['MALE', 'FEMALE', 'OTHERS'],
  },
  address: {
    type: String,
    required: true,
    minlength: 5
  },
  shoppingCart: [
    {
      productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
    },
  ],
});

customerSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

module.exports = mongoose.model('Customer', customerSchema,'customers');

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
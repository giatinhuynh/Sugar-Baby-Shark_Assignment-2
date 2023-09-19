var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const Product = require('../models/Product');
const Vendor = require('../models/Vendor');
const ProductController = require('../controllers/productController');


router.get('/get',ProductController.getProducts);

router.get('/get/:id', ProductController.getProductById);

router.post('/post', ProductController.createProduct);


 // Filter products by price and name
  router.get('/filter', async (req, res) => {
    let minPrice = parseFloat(req.query.minPrice);
    let maxPrice = parseFloat(req.query.maxPrice);
    const name = req.query.name;

    if (isNaN(minPrice)) minPrice = undefined;
    if (isNaN(maxPrice)) maxPrice = undefined;

    try {
      const query = {};
      if (minPrice !== undefined) query.price = { $gte: minPrice };
      if (maxPrice !== undefined) query.price = { ...query.price, $lte: maxPrice };
      if (name) query.name = new RegExp(name, 'i');

      const products = await Product.find(query).populate('vendor', 'businessName');
      res.send(products);
    } catch (err) {
      res.status(500).json({ message: 'Failed to filter products', error: err });
    }
  });

  module.exports = router;
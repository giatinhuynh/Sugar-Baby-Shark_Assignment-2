const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const Product = mongoose.model('Product');
const Vendor = mongoose.model('Vendor'); // Assuming you've already required Vendor model somewhere
const auth = require('./auth'); // Your authentication middleware

module.exports = (app) => {

  // Add a new product
  app.post('/api/products', auth, [
    check('name').isLength({ min: 10, max: 20 }),
    check('price').isFloat({ min: 0 }),
    check('description').isLength({ max: 500 })
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation errors', errors: errors.array() });
    }

    const { name, price, image, description } = req.body;
    const vendorId = req.vendor._id; // Assuming the vendor's ID is stored in req.vendor by your auth middleware

    // Verify if vendor exists
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    const product = new Product({
      name,
      price,
      image,
      description,
      vendor: vendorId
    });

    try {
      await product.save();
      res.status(201).send({ message: 'Product added successfully', product });
    } catch (err) {
      res.status(400).json({ message: 'Failed to add product', error: err });
    }
  });

  // View all products
  app.get('/api/products', async (req, res) => {
    try {
      const products = await Product.find().populate('vendor', 'businessName');
      res.send(products);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch products', error: err });
    }
  });

  // Filter products by price and name
  app.get('/api/products/filter', async (req, res) => {
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
};

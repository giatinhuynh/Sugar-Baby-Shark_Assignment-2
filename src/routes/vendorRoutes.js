// routes/vendorRoutes.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const Vendor = mongoose.model('Vendor');
const Product = mongoose.model('Product');
const NodeCache = require('node-cache');
const myCache = new NodeCache();

module.exports = (app) => {

  // Middleware for authentication
  const auth = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (myCache.get(token)) {
      return res.status(401).send({ error: 'This token has been blacklisted' });
    }
    const data = jwt.verify(token, 'your_jwt_secret');
    try {
      const vendor = await Vendor.findOne({ _id: data._id });
      if (!vendor) {
        throw new Error();
      }
      req.vendor = vendor;
      next();
    } catch (error) {
      res.status(401).send({ error: 'Not authorized to access this resource' });
    }
  };

  // Register a new vendor
  app.post('/api/vendors/register', [
    check('username').isLength({ min: 8, max: 15 }).isAlphanumeric(),
    check('password').isLength({ min: 8, max: 20 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/),
    check('businessName').isLength({ min: 5 }),
    check('businessAddress').isLength({ min: 5 })
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, businessName, businessAddress } = req.body;

    const vendor = new Vendor({
      username,
      password,
      businessName,
      businessAddress
    });

    try {
      await vendor.save();
      const token = jwt.sign({ _id: vendor._id }, 'your_jwt_secret');
      res.status(201).send({ vendor, token });
    } catch (err) {
      res.status(400).send(err);
    }
  });

  // Login a vendor
  app.post('/api/vendors/login', async (req, res) => {
    const { username, password } = req.body;

    const vendor = await Vendor.findOne({ username });

    if (!vendor) {
      return res.status(401).send({ error: 'Login failed' });
    }

    const isPasswordMatch = await bcrypt.compare(password, vendor.password);

    if (!isPasswordMatch) {
      return res.status(401).send({ error: 'Login failed' });
    }

    const token = jwt.sign({ _id: vendor._id }, 'your_jwt_secret');
    res.send({ vendor, token });
  });

  // Add new product
  app.post('/api/vendors/products', auth, async (req, res) => {
    const { name, price, image, description } = req.body;
    const product = new Product({
      name,
      price,
      image,
      description,
      vendor: req.vendor._id
    });

    try {
      await product.save();
      res.status(201).send({ success: true, product });
    } catch (err) {
      res.status(400).send(err);
    }
  });

  // Logout a vendor
  app.post('/api/vendors/logout', auth, (req, res) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    myCache.set(token, true, 60 * 60 * 24);  // Blacklist this token for 24 hours
    res.send({ success: true });
  });
};

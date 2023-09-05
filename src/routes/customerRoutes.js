// routes/customerRoutes.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const Customer = mongoose.model('Customer');
const NodeCache = require('node-cache');
const myCache = new NodeCache();

module.exports = (app) => {

  // Register a new customer
  app.post('/api/customers/register', [
    check('username').isLength({ min: 8, max: 15 }).isAlphanumeric(),
    check('password').isLength({ min: 8, max: 20 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/),
    check('name').isLength({ min: 5 }),
    check('address').isLength({ min: 5 })
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, name, address } = req.body;

    const customer = new Customer({
      username,
      password,
      name,
      address
    });

    try {
      await customer.save();
      const token = jwt.sign({ _id: customer._id }, 'your_jwt_secret');
      res.status(201).send({ customer, token });
    } catch (err) {
      res.status(400).send(err);
    }
  });

  // Login a customer
  app.post('/api/customers/login', async (req, res) => {
    const { username, password } = req.body;

    const customer = await Customer.findOne({ username });

    if (!customer) {
      return res.status(401).send({ error: 'Login failed' });
    }

    const isPasswordMatch = await bcrypt.compare(password, customer.password);

    if (!isPasswordMatch) {
      return res.status(401).send({ error: 'Login failed' });
    }

    const token = jwt.sign({ _id: customer._id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Added token expiry
    res.send({ customer, token });
  });

  // Middleware for authentication
  const auth = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (myCache.get(token)) {
      return res.status(401).send({ error: 'This token has been blacklisted' });
    }
    try {
      const data = jwt.verify(token, process.env.JWT_SECRET); // Using environment variable
      const customer = await Customer.findOne({ _id: data._id });
      if (!customer) {
        throw new Error('Customer not found');
      }
      req.customer = customer;
      next();
    } catch (error) {
      res.status(401).send({ error: 'Not authorized to access this resource' });
    }
  };

  // Get customer details
  app.get('/api/customers/me', auth, async (req, res) => {
    res.send(req.customer);
  });

  // Update customer profile picture
  app.put('/api/customers/me/picture', auth, async (req, res) => {
    const { profilePicture } = req.body;

    req.customer.profilePicture = profilePicture;
    await req.customer.save();

    res.send(req.customer);
  });

  // Logout a customer
  app.post('/api/customers/logout', auth, (req, res) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    myCache.set(token, true, 60 * 60 * 24);  // Blacklist this token for 24 hours
    res.send({ success: true });
  });
};

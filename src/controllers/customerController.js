// Import required modules and the Customer model
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const NodeCache = require('node-cache');
const myCache = new NodeCache();

// Register a new customer
exports.register = async (req, res) => {
  // Validate request data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Destructure request body
  const { username, password, name, address } = req.body;

  // Create a new Customer instance
  const customer = new Customer({
    username,
    password,
    name,
    address
  });

  try {
    // Save the customer to the database
    await customer.save();
    // Generate a JWT token
    const token = jwt.sign({ _id: customer._id }, 'your_jwt_secret');
    // Send success response
    res.status(201).send({ customer, token });
  } catch (err) {
    // Send error response
    res.status(400).send(err);
  }
};

// Login an existing customer
exports.login = async (req, res) => {
  // Destructure request body
  const { username, password } = req.body;

  // Find the customer by username
  const customer = await Customer.findOne({ username });

  // If customer not found, send error
  if (!customer) {
    return res.status(401).send({ error: 'Login failed' });
  }

  // Compare the provided password with the stored hash
  const isPasswordMatch = await bcrypt.compare(password, customer.password);

  // If password doesn't match, send error
  if (!isPasswordMatch) {
    return res.status(401).send({ error: 'Login failed' });
  }

  // Generate a JWT token with an expiry time
  const token = jwt.sign({ _id: customer._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  // Send success response
  res.send({ customer, token });
};

// Get details of the logged-in customer
exports.getCustomerDetails = async (req, res) => {
  // Send the customer details as response
  res.send(req.customer);
};

// Update the profile picture of the logged-in customer
exports.updateProfilePicture = async (req, res) => {
  // Destructure request body
  const { profilePicture } = req.body;

  // Update the profile picture field
  req.customer.profilePicture = profilePicture;
  // Save the updated customer to the database
  await req.customer.save();

  // Send the updated customer as response
  res.send(req.customer);
};

// Logout the logged-in customer
exports.logout = (req, res) => {
  // Get the token from the Authorization header
  const token = req.header('Authorization').replace('Bearer ', '');
  // Blacklist the token for 24 hours
  myCache.set(token, true, 60 * 60 * 24);
  // Send success response
  res.send({ success: true });
};

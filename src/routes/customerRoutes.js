// Import required modules and models
var express = require('express');
var router = express.Router();

const { check, validationResult } = require('express-validator');
const NodeCache = require('node-cache');
const myCache = new NodeCache();
const customerController = require('../controllers/customerController');
const Customer = require('../models/Customer');


  // Register a new customer
  router.post('/register', [
    check('username').isLength({ min: 8, max: 15 }).isAlphanumeric(),
    check('password').isLength({ min: 8, max: 20 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/),
    check('name').isLength({ min: 5 }),
    check('address').isLength({ min: 5 })
  ], customerController.register);  // Delegate to the controller's register method

  // Login a customer
  router.get('/login', async (req, res) => {
    try {
      res.render('login');
    } catch (err) {
      res.status(500).send(err);
    }
  });
  router.post('login', customerController.login);   // Delegate to the controller's login method

  // Middleware for authentication
  const auth = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (myCache.get(token)) {
      return res.status(401).send({ error: 'This token has been blacklisted' });
    }
    try {
      const data = jwt.verify(token, process.env.JWT_SECRET);
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
  router.get('/api/customers/me', auth, customerController.getCustomerDetails);  // Delegate to the controller's getCustomerDetails method


  // Update customer profile picture
  router.put('/api/customers/me/picture', auth, customerController.updateProfilePicture);  // Delegate to the controller's updateProfilePicture method

  // Logout a customer
  router.post('/api/customers/logout', auth, customerController.logout);  // Delegate to the controller's logout method

 

  module.exports = router;
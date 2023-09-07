// Import required modules and models
var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
const NodeCache = require('node-cache');
const myCache = new NodeCache();
const vendorController = require('../controllers/vendorController'); // Import the vendor controller

  // Middleware for authentication
  const auth = vendorController.authMiddleware; // Delegate to the controller's authMiddleware method

  // Register a new vendor
  router.post('/register', [
    check('username').isLength({ min: 8, max: 15 }).isAlphanumeric(),
    check('password').isLength({ min: 8, max: 20 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/),
    check('businessName').isLength({ min: 5 }),
    check('businessAddress').isLength({ min: 5 })
  ], vendorController.register);  // Delegate to the controller's register method

  // Login a vendor
  router.post('/login', vendorController.login);  // Delegate to the controller's login method

  // Add new product
  router.post('/products', auth, vendorController.addProduct);  // Delegate to the controller's addProduct method

  // Logout a vendor
  router.post('/logout', auth, vendorController.logout);  // Delegate to the controller's logout method



module.exports = router;
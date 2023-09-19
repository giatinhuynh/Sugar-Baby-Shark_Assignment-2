// Import required modules and models
var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
const NodeCache = require('node-cache');
const myCache = new NodeCache();
const vendorController = require('../controllers/vendorController'); // Import the vendor controller
const Vendor = require('../models/Vendor');

  // Middleware for authentication
  const auth = vendorController.authMiddleware; // Delegate to the controller's authMiddleware method

  // Register a new vendor

  router.post('/register', [
    check('username').isLength({ min: 8, max: 15 }).isAlphanumeric(),
    check('password').isLength({ min: 8, max: 20 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/),
    check('businessName').isLength({ min: 5 }),
    check('businessAddress').isLength({ min: 5 })
  ], vendorController.register);  // Delegate to the controller's register method

  
  // display view
    // Logout a vendor
    router.post('/logout', vendorController.logout);  // Delegate to the controller's logout method
  router.get('/register', vendorController.registerMenu); 
  router.get('/', vendorController.dasboard); 
  router.get('/me', vendorController.getVendorDetails);
  router.get('/login', vendorController.loginMenu);

  // Login a vendor m
  router.post('/login', vendorController.login);  // Delegate to the controller's login method
 

    // Get vendor details
   // Delegate to the controller's getCustomerDetails method
    router.get('/:id', vendorController.getVendorById); 
  // Add new product
  router.post('/products', auth, vendorController.addProduct);  // Delegate to the controller's addProduct method




  router.get('/get', async (req, res) => {
    try {
     
      console.log('View all vendors');
      //const products = await Product.find().populate('vendor', 'businessName');
     
      
      const vendors =  await Vendor.find();
      return res.send(vendors);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Failed to fetch vendors', error: err });
    }
    
  });

module.exports = router;
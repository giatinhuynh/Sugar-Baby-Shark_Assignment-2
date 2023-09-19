// Import required modules and models
var express = require('express');
var router = express.Router();

const { check, validationResult } = require('express-validator');
const NodeCache = require('node-cache');
const myCache = new NodeCache();
const customerController = require('../controllers/customerController');
const Customer = require('../models/Customer');


 // view 

  // Logout a customer
  router.get('/logout', customerController.logout);  // Delegate to the controller's logout method
 router.get('/register', customerController.registerMenu); 
 router.get('/login', customerController.loginMenu);   
 router.get('/', customerController.dasboard);
 router.get('/me', customerController.getCustomerDetails);
 // view Cart
  router.get('/cart', customerController.viewCart);


  router.post('/register', [
    check('username').isLength({ min: 8, max: 15 }).isAlphanumeric(),
    check('password').isLength({ min: 8, max: 20 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/),
    check('name').isLength({ min: 5 }),
    check('address').isLength({ min: 5 })
  ], customerController.register);  // Delegate to the controller's register method
 // Delegate to the controller's registerMenu method

 // add to cart
  router.post('/cart', customerController.addToCart);

  router.post('/login', customerController.login);   // Delegate to the controller's login menu

  // Get customer details
  // Delegate to the controller's getCustomerDetails method
  router.get('/:id', customerController.getCustomerById); 





  module.exports = router;



  // // Update the profile picture of the logged-in customer
// exports.updateProfilePicture = async (req, res) => {
//   // Destructure request body
//   const { profilePicture } = req.body;

//   // Update the profile picture field
//   req.customer.profilePicture = profilePicture;
//   // Save the updated customer to the database
//   await req.customer.save();

//   // Send the updated customer as response
//   res.send(req.customer);
// };

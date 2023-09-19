// Import required modules and models
var express = require('express');
var router = express.Router();
const { check } = require('express-validator');
const shipperController = require('../controllers/shipperController');

  // display view
    // Logout a vendor
   router.post('/logout', shipperController.logout);  // Delegate to the controller's logout method
  router.get('/register', shipperController.registerMenu); 
  router.get('/', shipperController.dasboard); 
  router.get('/me', shipperController.getShipperDetails);
  router.get('/login', shipperController.loginMenu);

  // Register a new shipper
  router.post('/register',  shipperController.register);

  // Login a shipper
  router.post('/login', shipperController.login);

  // Shipper can see all active orders at their distribution hub
  router.get('/orders', shipperController.viewOrders);

  // Shipper can update the status of an order
  router.put('/orders/:orderId',  shipperController.updateOrderStatus);


  module.exports = router;
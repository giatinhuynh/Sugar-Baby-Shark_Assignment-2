/* // RMIT University Vietnam
// Course: COSC2430 Web Programming
// Semester: 2023B
// Assessment: Assignment 2
// Author: Huynh Duc Gia Tin, Tran Ha Phuong, Nguyen Viet Ha, Phan Nhat Minh, Tran Nguyen Quoc An
// ID: s3962053, s3979638, s3978128, s3959931, s3978598 
// Acknowledgement: MDN Web Docs, Youtube, W3school, GeeksforGeeks, RMIT Canvas, ChatGPT, NPM Packages' Docs */

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
  router.get('/orders/:orderId',  shipperController.viewOrderDetails);
  router.get('/me/edit', shipperController.editShipperDetailsForm);
  router.get('/me/security', shipperController.changePasswordForm);

  // Register a new shipper
  router.post('/register',  shipperController.register);
  router.post('/me/edit', shipperController.editShipperDetails);
  // Login a shipper
  router.post('/login', shipperController.login);
  router.post('/me/security', shipperController.changePassword);
  // Shipper can see all active orders at their distribution hub
  router.get('/orders', shipperController.viewOrders);

  // Shipper can update the status of an order
  router.put('/orders/:orderId',  shipperController.updateOrderStatus);


  module.exports = router;
// Import required modules and models
var express = require('express');
var router = express.Router();
const { check } = require('express-validator');
const shipperController = require('../controllers/shipperController');


  // Register a new shipper
  router.post('/api/shippers/register', [
    check('username').isLength({ min: 8, max: 15 }).isAlphanumeric(),
    check('password').isLength({ min: 8, max: 20 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/),
    check('distributionHubId').not().isEmpty()
  ], shipperController.register);

  // Login a shipper
  router.post('/api/shippers/login', shipperController.login);

  // Logout a shipper
  router.post('/api/shippers/logout', shipperController.auth, shipperController.logout);

  // Shipper can see all active orders at their distribution hub
  router.get('/api/shippers/orders', shipperController.auth, shipperController.viewOrders);

  // Shipper can update the status of an order
  router.put('/api/shippers/orders/:orderId', shipperController.auth, shipperController.updateOrderStatus);


  module.exports = router;
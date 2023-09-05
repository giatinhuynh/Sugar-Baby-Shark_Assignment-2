const { check } = require('express-validator');
const shipperController = require('../controllers/shipperController');

module.exports = (app) => {
  // Register a new shipper
  app.post('/api/shippers/register', [
    check('username').isLength({ min: 8, max: 15 }).isAlphanumeric(),
    check('password').isLength({ min: 8, max: 20 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/),
    check('distributionHubId').not().isEmpty()
  ], shipperController.register);

  // Login a shipper
  app.post('/api/shippers/login', shipperController.login);

  // Logout a shipper
  app.post('/api/shippers/logout', shipperController.auth, shipperController.logout);

  // Shipper can see all active orders at their distribution hub
  app.get('/api/shippers/orders', shipperController.auth, shipperController.viewOrders);

  // Shipper can update the status of an order
  app.put('/api/shippers/orders/:orderId', shipperController.auth, shipperController.updateOrderStatus);
};

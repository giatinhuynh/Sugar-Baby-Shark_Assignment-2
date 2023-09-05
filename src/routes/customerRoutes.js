// Import required modules and models
const { check, validationResult } = require('express-validator');
const NodeCache = require('node-cache');
const myCache = new NodeCache();
const customerController = require('../controllers/customerController');

module.exports = (app) => {

  // Register a new customer
  app.post('/api/customers/register', [
    check('username').isLength({ min: 8, max: 15 }).isAlphanumeric(),
    check('password').isLength({ min: 8, max: 20 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/),
    check('name').isLength({ min: 5 }),
    check('address').isLength({ min: 5 })
  ], customerController.register);  // Delegate to the controller's register method

  // Login a customer
  app.post('/api/customers/login', customerController.login);  // Delegate to the controller's login method

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
  app.get('/api/customers/me', auth, customerController.getCustomerDetails);  // Delegate to the controller's getCustomerDetails method

  // Update customer profile picture
  app.put('/api/customers/me/picture', auth, customerController.updateProfilePicture);  // Delegate to the controller's updateProfilePicture method

  // Logout a customer
  app.post('/api/customers/logout', auth, customerController.logout);  // Delegate to the controller's logout method
};

// Import required modules and models
const { check, validationResult } = require('express-validator');
const NodeCache = require('node-cache');
const myCache = new NodeCache();
const vendorController = require('../controllers/vendorController'); // Import the vendor controller

module.exports = (app) => {

  // Middleware for authentication
  const auth = vendorController.authMiddleware; // Delegate to the controller's authMiddleware method

  // Register a new vendor
  app.post('/api/vendors/register', [
    check('username').isLength({ min: 8, max: 15 }).isAlphanumeric(),
    check('password').isLength({ min: 8, max: 20 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/),
    check('businessName').isLength({ min: 5 }),
    check('businessAddress').isLength({ min: 5 })
  ], vendorController.register);  // Delegate to the controller's register method

  // Login a vendor
  app.post('/api/vendors/login', vendorController.login);  // Delegate to the controller's login method

<<<<<<< Updated upstream
=======
  
  // display view
    // Logout a vendor
    router.post('/logout', vendorController.logout);  // Delegate to the controller's logout method
  router.get('/register', vendorController.registerMenu); 
  router.get('/', vendorController.dasboard); 
  router.get('/me', vendorController.getVendorDetails);
  router.get('/login', vendorController.loginMenu);
  router.get('/product', vendorController.productForm); 
  // Login a vendor m
  router.post('/login', vendorController.login);  // Delegate to the controller's login method
 

    // Get vendor details
   // Delegate to the controller's getCustomerDetails method
    router.get('/:id', vendorController.getVendorById); 
>>>>>>> Stashed changes
  // Add new product
  app.post('/api/vendors/products', auth, vendorController.addProduct);  // Delegate to the controller's addProduct method

  // Logout a vendor
  app.post('/api/vendors/logout', auth, vendorController.logout);  // Delegate to the controller's logout method
};

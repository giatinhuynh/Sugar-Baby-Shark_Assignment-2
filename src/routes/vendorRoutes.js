// Import required modules and models
var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');

const NodeCache = require('node-cache');
const myCache = new NodeCache();
const vendorController = require('../controllers/vendorController'); // Import the vendor controller
const Vendor = require('../models/Vendor');

const imageStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    const destinationPath = path.join(__dirname, '../../public/images/profilePictures');
    callback(null, destinationPath); // Set the absolute destination folder for uploaded files
  },
  filename: (req, file, callback) => {
    callback(null,  req.session.vendorId+".jpg"); // Set the file name
  },
  overwrite: true,
});
const upload = multer({ storage: imageStorage });
  // Middleware for authentication
  const auth = vendorController.authMiddleware; // Delegate to the controller's authMiddleware method

  // Register a new vendor

  router.post('/register', vendorController.register);  // Delegate to the controller's register method

  
  // display view
    // Logout a vendor
    router.get('/logout', vendorController.logout);  // Delegate to the controller's logout method
  router.get('/register', vendorController.registerMenu); 
  router.get('/', vendorController.dasboard); 
  router.get('/me', vendorController.getVendorDetails);
  router.get('/me/edit', vendorController.editVendorDetailsForm);
  router.get('/me/security', vendorController.changePasswordForm);
  router.get('/login', vendorController.loginMenu);
  router.get('/product/:id?', vendorController.productForm);
  router.get('/products', vendorController.products);

  // Login a vendor m
  router.post('/login', vendorController.login);  // Delegate to the controller's login method
 

    // Change vendor details
    router.post('/me/edit', upload.single('image'),vendorController.editVendorDetails);
    // change pass
    router.post('/me/security', vendorController.changePassword);
   // Delegate to the controller's getCustomerDetails method
    router.get('/:id', vendorController.getVendorById); 
  // Add new product
  router.post('/product/:id?', vendorController.addProduct);  // Delegate to the controller's addProduct method




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
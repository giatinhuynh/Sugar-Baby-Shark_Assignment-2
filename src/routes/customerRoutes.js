// Import required modules and models
var express = require('express');
var router = express.Router();
const Product = require('../models/Product');
const { check, validationResult } = require('express-validator');
const NodeCache = require('node-cache');
const myCache = new NodeCache();
const customerController = require('../controllers/customerController');
const Customer = require('../models/Customer');


 // view 
 router.get('/search', (req, res) => {
  
  console.log("search");
  const searchQuery = req.query.query; // Get the search query from the request
  console.log(searchQuery);
  const minPrice = parseFloat(req.query.minPrice); // Get the min price if needed
  const maxPrice = parseFloat(req.query.maxPrice); // Get the max price if needed

  // Use the searchQuery and optional price filters to search for products in your database
  // Replace this with your actual database search logic
  // For example, you can use Mongoose for MongoDB or any other database library

  // Query the database for products with matching names
  Product.find({ name: { $regex: new RegExp(searchQuery, 'i') } })
    .then((products) => {
      // Filter products based on price if minPrice and maxPrice are provided
      if (!isNaN(minPrice) && !isNaN(maxPrice)) {
        products = products.filter(
          (product) => product.price >= minPrice && product.price <= maxPrice
        );
      }

      // Render a view with the search results
      res.render('dashboard', { items: products });
    })
    .catch((error) => {
      // Handle any errors
      console.error('Error searching for products:', error);
      res.status(500).send('Internal Server Error');
    });
});
  // Logout a customer
  router.get('/logout', customerController.logout);  // Delegate to the controller's logout method
 router.get('/register', customerController.registerMenu); 
 router.get('/login', customerController.loginMenu);   
 router.get('/', customerController.dasboard);
 router.get('/me', customerController.getCustomerDetails);
 // view Cart
  router.get('/cart', customerController.viewCart);


  router.post('/register', customerController.register);  // Delegate to the controller's register method
 // Delegate to the controller's registerMenu method

 // add to cart
  router.post('/cart', customerController.addToCart);

  router.post('/login', customerController.login);   // Delegate to the controller's login menu

  // Get customer details
  // Delegate to the controller's getCustomerDetails method
  router.get('/:id', customerController.getCustomerById); 
  router.get('/product/:id', customerController.getProductDetails); 

  // Import necessary modules and set up your Express app

// Define a route to handle product search


// Start your Express server






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

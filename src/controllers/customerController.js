// Import required modules and the Customer model
const mongoose = require("mongoose");
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Controller = require("./Controller");
const customerService = require("../services/customerService");
const Customer = require('../models/Customer');

const customer = mongoose.model("Customer");
const CustomerService = new customerService(customer);

const NodeCache = require('node-cache');
const Product = require("../models/Product");
const myCache = new NodeCache();

class CustomerController extends Controller {
  constructor(service) {
    super(service);
  }


 async register(req, res)  {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { username, password, name, address } = req.body;
  const customer = new Customer({
    username,
    password,
    name,
    address
  });

  const response = await CustomerService.createProduct(customer);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
};
// display view
async loginMenu(req, res) {
  try {
    console.log("login view");
    res.render('login');
    console.log("login view after");
  } catch (err) {
    res.status(404).send(err);
  }
};
async registerMenu(req, res) {
  try {
    res.render('registerCustomer');
  } catch (err) {
    res.status(404).send(err);
  }
}
async dasboard(req, res) {
  
  try {
    // delete if statement to bypass login
    if (req.session.customerId && req.session.customerId.trim() !== '') {
      // test with array of products
      const products = [
        {
          _id: '1',
          name: 'Product 1',
          price: 100,
          image: 'https://picsum.photos/300/300',
          description: 'This is a product description'
        },
        {
          _id: '2',
          name: 'Product 2',
          price: 200,
          image: 'https://picsum.photos/300/300',
          description: 'This is a product description'
        },
        {
          _id: '3',
          name: 'Product 3',
          price: 300,
          image: 'https://picsum.photos/300/300',
          description: 'This is a product description'
        },
      ];
      res.render('dashboard', { items: products });}
    else {
      res.status(404).send({ error: 'Not Found' });
    }
  } catch (err) {
    res.status(404).send(err);
  }
}
async login (req, res) {
  console.log("login post");
const { username, password } = req.body;
  const customer = await Customer.findOne({ username, password });
  if (!customer) {
    return res.status(401).send({ error: 'Login failed' });
  }

  // Compare the provided password with the stored hash
  // const isPasswordMatch = await bcrypt.compare(password, customer.password);
  // If password doesn't match, send error
  // if (!isPasswordMatch) {
  //   return res.status(401).send({ error: 'Login failed' });
  // }
  // Generate a JWT token with an expiry time
  
  req.session.customerId = customer._id;
  const token = jwt.sign({ _id: customer._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  // Send success response
 // res.send({ customer, token });
  res.redirect("/api/customers/");
};

// Get details of the logged-in customer
async  getCustomerById(req, res) {
  let response = await CustomerService.getCustomerById(req.params.id);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
};

async  getCustomerDetails(req, res) {
  const customerId = req.session.customerId;
  let response = await CustomerService.getCustomerById(customerId);
    if (response.error) return res.status(response.statusCode).send(response);
    res.render('myAccount', { customer: response.data });
};

// view Cart
async viewCart(req, res) {
  const customerId = req.session.customerId;
  let response = await CustomerService.getCustomerById(customerId);
  
    if (response.error) return res.status(response.statusCode).send(response);

    const products = [
      {
        name: 'Product 1',
        price: 19.99,
        image: 'product1.jpg',
        description: 'Description for Product 1',
      },
      {
        name: 'Product 2 with a Longer Name',
        price: 29.99,
        image: 'product2.jpg',
        description: 'Description for Product 2',
      },
      {
        name: 'Product 3',
        price: 14.99,
        image: 'product3.jpg',
        description: 'Description for Product 3',
      },
    ];
    res.render('shoppingCart', { cartItems: products });
    // res.render('shoppingCart', { customer: response.data });
}

async addToCart(req, res) {
  
    const customerId = req.session.customerId;
    const customer = await CustomerService.getCustomerById(customerId);
    
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const { productId, quantity } = req.body;
    
    // Add the product to the shopping cart
    const response = await CustomerService.addToCart(customerId, productId, quantity);

    if (response.error) {
      return res.status(response.statusCode).json(response);
    }
    else{
    // Redirect to the shopping cart page or any other page as needed
    res.redirect("/api/customers/cart");}
 
}
// Logout the logged-in customer
async logout(req, res)  {
  console.log("logout");
  req.session.customerId = null;
  // // Get the token from the Authorization header
  // const token = req.header('Authorization').replace('Bearer ', '');
  // // Blacklist the token for 24 hours
  // myCache.set(token, true, 60 * 60 * 24);
  // // Send success response
  res.redirect("/api/customers/login");
};

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

}

module.exports = new CustomerController(customerService);

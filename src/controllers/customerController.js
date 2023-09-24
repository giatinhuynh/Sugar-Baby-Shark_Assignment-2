/* // RMIT University Vietnam
// Course: COSC2430 Web Programming
// Semester: 2023B
// Assessment: Assignment 2
// Author: Huynh Duc Gia Tin, Tran Ha Phuong, Nguyen Viet Ha, Phan Nhat Minh, Tran Nguyen Quoc An
// ID: s3962053, s3979638, s3978128, s3959931, s3978598 
// Acknowledgement: MDN Web Docs, Youtube, W3school, GeeksforGeeks, RMIT Canvas, ChatGPT, NPM Packages' Docs */

// Import required modules and the Customer model
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Controller = require("./Controller");
const customerService = require("../services/customerService");
const Customer = require('../models/Customer');
const Product = mongoose.model("Product");
const productService = require("../services/productService");
const ProductService = new productService(Product);
const DistributionHub = require('../models/DistributionHub');
const customer = mongoose.model("Customer");
const CustomerService = new customerService(customer);

const NodeCache = require('node-cache');
const myCache = new NodeCache();

class CustomerController extends Controller {
  constructor(service) {
    super(service);
  }


 async register(req, res)  {
  
  const { username, password, name, address, gender, profilePicture } = req.body;
  const customer = new Customer({
    username,
    password,
    name,
    gender,
    address,
    profilePicture
  });

  const response = await CustomerService.createCustomer(customer);
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
  console.log("dashboard");
  
  
    const items = await ProductService.getProducts();
    console.log(items);

    res.render('dashboard', { items: items.data.data });
   
 
}
async login (req, res) {
  console.log("login post");
 const { username, password } = req.body;
const customer = await Customer.findOne({ username });
if (!customer) {
  return res.status(401).send({ error: 'Username not found' });
}
const isPasswordMatch = await bcrypt.compare(password, customer.password);
if (!isPasswordMatch) {
  return res.status(401).send({ error: 'Incorrect password' });
}

  //Compare the provided password with the stored hash
  

  
  req.session.customerId = customer._id;
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

  try {
    const distributionHubs = await DistributionHub.find();
    const customer = await Customer.findById(customerId);

    if (!customer) return res.status(404).send({ error: 'Customer not found.' });

    // Convert shoppingCart items to include product details
    const cartItems = await Promise.all(customer.shoppingCart.map(async (item) => {
      const product = await ProductService.getProductById(item.productId);

      if (!product) {
        // Handle the case where the product is not found (optional)
        return null;
      }

      return {
        _id: item.productId, // Use item.productId directly
        name: product.data.name,
        image: product.data.image,  // Assuming Product schema has an 'image' field
        price: product.data.price,  // Assuming Product schema has a 'price' field
        quantity: item.quantity // Use item.quantity to get the quantity from the shopping cart
      };
    }));

    // Filter out any null values (products not found)
    const filteredCartItems = cartItems.filter(item => item !== null);

    console.log(filteredCartItems);
    res.render('shoppingCart', { cartItems: filteredCartItems, customer , distributionHubs: distributionHubs });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
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



async getProductDetails(req, res) {
  const productId = req.params.id;
  const product = await ProductService.getProductById(productId);
  res.render('productDetail', { product: product.data });
}
}

module.exports = new CustomerController(customerService);

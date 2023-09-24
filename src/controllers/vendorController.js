/* // RMIT University Vietnam
// Course: COSC2430 Web Programming
// Semester: 2023B
// Assessment: Assignment 2
// Author: Huynh Duc Gia Tin, Tran Ha Phuong, Nguyen Viet Ha, Phan Nhat Minh, Tran Nguyen Quoc An
// ID: s3962053, s3979638, s3978128, s3959931, s3978598 
// Acknowledgement: MDN Web Docs, Youtube, W3school, GeeksforGeeks, RMIT Canvas, ChatGPT, NPM Packages' Docs */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Controller = require('./Controller');
const ProductController = require('./productController');

const Vendor = require('../models/Vendor');
const vendorService = require('../services/vendorService');
const VendorService = new vendorService(Vendor);

const Product = require('../models/Product')
const productService = require('../services/productService');
const ProductService = new productService(Product);

const NodeCache = require('node-cache');
const myCache = new NodeCache();


class VendorController extends Controller {
  constructor(service) {
    super(service);
   
  }


// display
async loginMenu(req, res) { 
  try {
   
  res.render('loginShipperVendor');
} catch (err) {
  res.status(404).send(err);
}
}
async registerMenu(req, res) {
  try {
    res.render('registerVendor');
  } catch (err) {
    res.status(404).send(err);
  }
}
async dasboard(req, res) {
  
  try {
    
    
      const vendor = await VendorService.getVendorById(req.session.vendorId);
      console.log(vendor);
    res.render('vendorDashboard', {vendor: vendor});}
    
  catch (err) {
    res.status(404).send(err);
  }
}

async productForm(req, res) { 
  console.log("product form");
  try {
    console.log(req.params.id);
    const productId = req.params.id; // Access the optional id parameter
  if (productId) {
    // Handle the case when id is provided
    console.log("update product");
    const product = await ProductService.getProductById(productId);
    console.log("Edit: ",product);
    res.render('addNewProduct', { product: product.data });
  } else {
    console.log("new product");
    res.render('addNewProduct', { product: null });
  }
  
} catch (err) {
  res.status(404).send(err);
}
}
async products(req, res) { 
  try {

    
   const products = await Product.find({vendor: req.session.vendorId});
   console.log(products);
  res.render('viewMyProducts', {products: products});
} catch (err) {
  res.status(404).send(err);
}
}
// Register a new vendor
async register(req, res) {
  
  const { username, password, businessName, businessAddress, profilePicture} = req.body;

  const vendor = new Vendor({
    username,
    password,
    businessName,
    businessAddress,
    profilePicture
  });

  try {
    await vendor.save();
    const token = jwt.sign({ _id: vendor._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).send({ vendor, token });
  } catch (err) {
    res.status(400).send(err);
  }
};

// Login a vendor
async login (req, res)  {
  const { username, password } = req.body;
  const vendor = await Vendor.findOne({ username });
  if (!vendor) {
    return res.status(401).send({ error: 'Username not found' });
  }
  const isPasswordMatch = await bcrypt.compare(password, vendor.password);
  if (!isPasswordMatch) {
    return res.status(401).send({ error: 'Incorrect password' });
  }
  req.session.vendorId = vendor._id;
  res.redirect("/api/vendors/");
};

async  getVendorById(req, res) {
  let response = await VendorService.getVendorById(req.params.id);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
};

async  getVendorDetails(req, res) {
  const vendorId = req.session.vendorId;
  let response = await VendorService.getVendorById(vendorId);
    if (response.error) return res.status(response.statusCode).send(response);
    res.render('vendorAccount', { vendor: response.data });
};
async  editVendorDetailsForm(req, res) {
  const vendorId = req.session.vendorId;
  let response = await VendorService.getVendorById(vendorId);
    if (response.error) return res.status(response.statusCode).send(response);
    res.render('vendorEditProfile', { vendor: response.data });
}
async  changePasswordForm(req, res) {
  res.render('vendorSecurity');
}

async  changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;
  console.log(currentPassword, newPassword)
  const vendorId = req.session.vendorId;
  let vendor = await VendorService.getVendorById(vendorId);
  const isPasswordMatch = await bcrypt.compare(currentPassword, vendor.data.password);
  if (!isPasswordMatch) {
    return res.status(401).send({ error: 'Incorrect password' });
  }
  else {
    console.log("password match");
     // Hash the new password
     const hashedPassword = await bcrypt.hash(newPassword, 10);
     // Update the vendor's password with the hashed password
    vendor.data.password = hashedPassword;
    let response = await VendorService.updateVendor(vendorId,vendor.data);
  
      if (response.error) return res.status(response.statusCode).send(response.error);
      res.redirect("/api/vendors/me");
  }
 
    
}
async editVendorDetails(req, res) {
  
  const { username, businessName, businessAddress} = JSON.stringify(req.body);
  console.log(req.body);
  let vendor = await VendorService.getVendorById(req.session.vendorId);
  vendor.data.username = username;
  vendor.data.businessName = businessName;
  vendor.data.businessAddress = businessAddress;
  if (req.file) {
    // Update the profilePicture field with the new file path
    vendor.data.profilePicture = req.file.path;
  }



  let response = await VendorService.updateVendor(req.session.vendorId,vendor.data);
   response = await VendorService.getVendorById(req.session.vendorId);

  if (response.error) return res.status(response.statusCode).send(response);
  return res.redirect("/api/vendors/me");
 

};

// Add new product
async addProduct (req, res)  {
  const { name, description, price, productImage } = req.body;
  console.log(req.body);
    console.log("product id: ",req.params.id);
    const productId = req.params.id; // Access the optional id parameter
    console.log("product id: ",productId);
  if (productId) {
    // Handle the case when id is provided
    console.log("update product Post");
    const product = await ProductService.getProductById(productId);
    product.data.name = name;
    product.data.description = description;
    product.data.price = price;
    product.data.image = productImage;
    let response = await ProductService.updateProduct(productId,product.data);
    if (response.error) return res.status(response.statusCode).send(response);
  return res.redirect("/api/vendors/products");
   
  } else {
    console.log("new product");

    const product = new Product({
      name: name,
      description: description,
      price: price,
      image: productImage,
      vendor: req.session.vendorId
    });
    let response = await ProductService.createProduct(product);
    if (response.error) return res.status(response.statusCode).send(response);
  return res.redirect("/api/vendors/products");
  }
};

// Logout a vendor
async logout  (req, res)  {
  console.log("logout");
  req.session.vendorId = null;
  res.redirect("/api/vendors/login");
 
};

}

module.exports = new VendorController(VendorService);

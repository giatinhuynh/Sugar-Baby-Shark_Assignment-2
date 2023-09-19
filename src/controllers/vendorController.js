const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Vendor = require('../models/Vendor');
const Product = require('../models/Product')
const Controller = require('./Controller');
const ProductController = require('./productController');

const { loginMenu } = require('./customerController');
const vendorService = require('../services/vendorService');
const VendorService = new vendorService(Vendor);

const NodeCache = require('node-cache');
const productController = require('./productController');
const myCache = new NodeCache();


class VendorController extends Controller {
  constructor(service) {
    super(service);
   
  }

// Middleware for authentication
async authMiddleware (req, res, next) {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (myCache.get(token)) {
    return res.status(401).send({ error: 'This token has been blacklisted' });
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    const vendor = await Vendor.findOne({ _id: data._id });
    if (!vendor) {
      throw new Error('Vendor not found');
    }
    req.vendor = vendor;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Not authorized to access this resource' });
  }
};

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
    if (req.session.vendorId && req.session.vendorId.trim() !== '') {
      console.log(req.session.vendorId);
    res.render('vendorDashboard');}
    else {
      res.status(404).send({ error: 'Not Found' });
    }
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
  const token = jwt.sign({ _id: vendor._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
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

// Add new product
async addProduct (req, res)  {
  const { name, price, image, description } = req.body;
  const product = new Product({
    name,
    price,
    image,
    description,
    vendor: req.session.vendor._id
  });

  let response=await productController.createProduct(product);
  if (response.error) return res.status(response.statusCode).send(response);
  return res.status(201).send(response);
};

// Logout a vendor
async logout  (req, res)  {
  req.session.customerId = null;
  const token = req.header('Authorization').replace('Bearer ', '');
  myCache.set(token, true, 60 * 60 * 24);  // Blacklist this token for 24 hours
  res.send({ success: true });
};

}

module.exports = new VendorController(VendorService);

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Vendor = mongoose.model('Vendor');
const Product = mongoose.model('Product');
const NodeCache = require('node-cache');
const myCache = new NodeCache();

// Middleware for authentication
const authMiddleware = async (req, res, next) => {
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

<<<<<<< Updated upstream
=======
// display
async loginMenu(req, res) { 
  try {
   
  res.render('loginShipperVendor');
} catch (err) {
  res.status(404).send(err);
}
}
async productForm(req, res) { 
  try {
   
  res.render('addNewProduct');
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

>>>>>>> Stashed changes
// Register a new vendor
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password, businessName, businessAddress } = req.body;

  const vendor = new Vendor({
    username,
    password,
    businessName,
    businessAddress
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
const login = async (req, res) => {
  const { username, password } = req.body;

  const vendor = await Vendor.findOne({ username });

  if (!vendor) {
    return res.status(401).send({ error: 'Login failed' });
  }

  const isPasswordMatch = await bcrypt.compare(password, vendor.password);

  if (!isPasswordMatch) {
    return res.status(401).send({ error: 'Login failed' });
  }

  const token = jwt.sign({ _id: vendor._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.send({ vendor, token });
};

// Add new product
const addProduct = async (req, res) => {
  const { name, price, image, description } = req.body;
  const product = new Product({
    name,
    price,
    image,
    description,
    vendor: req.vendor._id
  });

  try {
    await product.save();
    res.status(201).send({ success: true, product });
  } catch (err) {
    res.status(400).send(err);
  }
};

// Logout a vendor
const logout = (req, res) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  myCache.set(token, true, 60 * 60 * 24);  // Blacklist this token for 24 hours
  res.send({ success: true });
};

module.exports = {
  authMiddleware,
  register,
  login,
  addProduct,
  logout
};

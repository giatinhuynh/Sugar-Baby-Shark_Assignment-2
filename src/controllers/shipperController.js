const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Shipper = require('../models/Shipper');
const DistributionHub = require('../models/DistributionHub');
const Order = require('../models/Order');
const shipperService = require("../services/shipperService");
const Controller = require("./Controller");

const shipper = mongoose.model("Shipper");
const ShipperService = new shipperService(shipper);
const NodeCache = require('node-cache');
const DistributionHubService = require('../services/distributionHubService');
const myCache = new NodeCache();



class ShipperController extends Controller {
  constructor(service) {
    super(service);
   
  }
// Middleware for authentication
async auth (req, res, next) {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (myCache.get(token)) {
    return res.status(401).send({ error: 'This token has been blacklisted' });
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    const shipper = await Shipper.findOne({ _id: data._id });
    if (!shipper) {
      throw new Error('Shipper not found');
    }
    req.shipper = shipper;
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
    console.log("register menu");
    const response = await DistributionHub.find();
    console.log(response);
    res.render('registerShipper', { distributionHub: response });
  } catch (err) {
    res.status(404).send(err);
  }
}
async dasboard(req, res) {
  
  try {
    if (req.session.shipperId && req.session.shipperId.trim() !== '') {
      console.log(req.session.shipperId);
    res.render('shipperDashboard');
  }
    else {
      res.status(404).send({ error: 'Not Found' });
    }
  } catch (err) {
    res.status(404).send(err);
  }
}

// Register a new shipper
async register (req, res)  {

  const { username, password, distributionHub , profilePicture} = req.body;

const distributionHubId = distributionHub
  const shipper = new Shipper({
    username,
    password,
    distributionHubId,
    profilePicture
  });


    const response = await ShipperService.createShipper(shipper);
    const token = jwt.sign({ _id: shipper._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    if (response.error) return res.status(response.statusCode).send(response);
    return  res.redirect("/api/shippers/login");
  
};

// Login a shipper
async login (req, res)  {
  const { username, password } = req.body;
  const shipper = await Shipper.findOne({ username });
 
  if (!shipper) {
    return res.status(401).send({ error: 'Login failed' });
  }

  //Compare the provided password with the stored hash
  
  const isPasswordMatch = await bcrypt.compare(password, shipper.password);
  if (!isPasswordMatch) {
    return res.status(401).send({ error: 'Login failed' });
  }
  req.session.shipperId = shipper._id;
  const token = jwt.sign({ _id: shipper._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.redirect("/api/shippers/");
};

// Logout a shipper
async logout (req, res) {
  console.log("logout");
  req.session.shipper = null;
  // // Get the token from the Authorization header
  // const token = req.header('Authorization').replace('Bearer ', '');
  // // Blacklist the token for 24 hours
  // myCache.set(token, true, 60 * 60 * 24);
  // // Send success response
  res.redirect("/api/shippers/login");
};

// Shipper can see all active orders at their distribution hub
async viewOrders (req, res) {
  const shipperId = req.session.shipperId;
  let shipper = await ShipperService.getShipperById(shipperId);
  const distributionHubId = shipper.data.distributionHubId;
  const orders = await Order.find({ distributionHubId: distributionHubId, status: 'active' });
  res.send(orders);
};

// get shipper details
async  getShipperDetails(req, res) {
  const shipperId = req.session.shipperId;
  let response = await ShipperService.getShipperById(shipperId);
    if (response.error) return res.status(response.statusCode).send(response);
   return  res.render('shipperAccount', { shipper: response.data });
};

// Shipper can update the status of an order
async updateOrderStatus  (req, res)  {
  const shipperId = req.session.shipperId;
  let shipper = await ShipperService.getShipperById(shipperId);
  const distributionHubId = shipper.data.distributionHubId;
  const { status } = req.body;
  const order = await Order.findOne({ _id: req.params.orderId, distributionHubId: distributionHubId });
  if (!order) {
    return res.status(404).send({ error: 'Order not found' });
  }
  order.status = status;
  await order.save();
  res.send(order);
};


}

module.exports = new ShipperController(shipperService);

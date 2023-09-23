const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Shipper = require('../models/Shipper');
const DistributionHub = require('../models/DistributionHub');
const Order = require('../models/Order');
const shipperService = require("../services/shipperService");
const Controller = require("./Controller");
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const shipper = mongoose.model("Shipper");
const ShipperService = new shipperService(shipper);
const order = mongoose.model("Order");
const orderService = require("../services/orderService");
const OrderService = new orderService(order);
const NodeCache = require('node-cache');
const distributionHub = require('../services/distributionHubService');
const DistributionHubService = new distributionHub(DistributionHub);
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
const shipper= await ShipperService.getShipperById(req.session.shipperId);
// const distributionHub = DistributionHubService.getDistributionHubById(shipper.data.distributionHubId);
    res.render('shipperDashboard',{shipper:shipper.data});
  }
    else {
      res.status(404).send({ error: 'Not Found' });
    }
  } catch (err) {
    res.status(404).send(err);
  }
}
async  changePasswordForm(req, res) {
  res.render('shipperSecurity');
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
    return res.status(401).send({ error: 'Username failed' });
  }

  //Compare the provided password with the stored hash
  
  const isPasswordMatch = await bcrypt.compare(password, shipper.password);
  if (!isPasswordMatch) {
    return res.status(401).send({ error: 'Incorrect password' });
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
async editShipperDetails(req, res) {
  
  const { username, businessName, businessAddress, profilePicture} = req.body;
  let shipper = await ShipperService.getShipperById(req.session.shipperId);
  shipper.data.username = username;
  shipper.data.businessName = businessName;
  shipper.data.businessAddress = businessAddress;
  shipper.data.profilePicture = profilePicture;


  let response = await ShipperService.updateShipper(req.session.shipperId,shipper.data);
   response = await ShipperService.getShipperById(req.session.shipperId);

  if (response.error) return res.status(response.statusCode).send(response);
  return res.redirect("/api/vendors/me");
 

};
// Shipper can see all active orders at their distribution hub
async viewOrders (req, res) {
  const shipperId = req.session.shipperId;
  if (shipperService){
  let shipper = await ShipperService.getShipperById(shipperId);
  const distributionHubId = shipper.data.distributionHubId;
  const orders = await Order.find({ distributionHubId: distributionHubId, status: 'active' });
  const customerNames = {};
  await Promise.all(orders.map(async (order) => {
    const customerId = order.customerId;

    // Execute the Mongoose query and await its result
    const customer = await Customer.findOne({ _id: customerId }, 'name').exec();

    if (customer) {
      customerNames[order._id] = customer.name; // Store the customer name in the object
    }
  }));
  console.log(customerNames);
  res.render("viewOrders", { orders: orders , shipper:shipper.data, customerNames: customerNames});}
};
async  editShipperDetailsForm(req, res) {
  const shipperId = req.session.shipperId;
  let response = await ShipperService.getShipperById(shipperId);
    if (response.error) return res.status(response.statusCode).send(response);
    res.render('shipperEditProfile', { shipper: response.data });
}
// get shipper details
async  getShipperDetails(req, res) {
  const shipperId = req.session.shipperId;
  let response = await ShipperService.getShipperById(shipperId);
  const distributionHub = DistributionHubService.getDistributionHubById(response.data.distributionHubId);

    if (response.error) return res.status(response.statusCode).send(response);
   return  res.render('shipperAccount', { shipper: response.data, distributionHub: distributionHub.data });
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

async viewOrderDetails (req, res)  {
  const orderId = req.params.orderId;
  const order = await OrderService.getOrderById(orderId);
  const productNames = {};
  await Promise.all(order.data.products.map(async (product) => {
    const productId = product.productId;

    // Execute the Mongoose query and await its result
    const productName = await Product.findOne({ _id: productId }, 'name').exec();

    if (productName) {
      productNames[productId] = productName.name; 
    }
  }));
  console.log(productNames);
  res.render("orderDetail", { order: order.data, productNames: productNames});

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
}

module.exports = new ShipperController(shipperService);

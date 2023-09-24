const mongoose = require("mongoose");
const orderService = require("../services/orderService");
const Controller = require("./Controller");
const distributionHubService = require("../services/distributionHubService");
const Customer = require('../models/Customer');
const DistributionHub = mongoose.model("DistributionHub");
const Order = mongoose.model("Order");
const Shipper = mongoose.model("Shipper");
const OrderService = new orderService(Order);
const DistributionHubService = new distributionHubService(DistributionHub);
const { check, validationResult } = require('express-validator');
const shipperService = require("../services/shipperService");
const ShipperService = new shipperService(Shipper);


class OrderController extends Controller {
  constructor(service) {
    super(service);
  }

  async createOrder(req, res) {
    // Validation checks for order data
    console.log('Creating order');
    console.log('Request body',req.body); ;
        const distributionHubId = req.body.distributionHubId;
        const totalPrice = req.body.totalPrice;
        
        const customerId = req.session.customerId; // Assuming the customer's ID is stored in req.customer by your auth middleware
        const customer = await Customer.findOne({ _id: customerId });
  const products = customer.products ;
        // Verify if the distribution hub exists
       
    
        
    
  
        const order = new Order({
          customerId,
         distributionHubId,
         
          products,
          totalPrice,
          status: 'active'
        });
        console.log(order);

      const response = await OrderService.createOrder(order);
      if (response.error) return res.status(response.statusCode).send(response);
      return res.status(201).send(response);
    
  }

  async getOrders(req, res) {
    const response = await OrderService.getOrders();
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }

  async getOrderById(req, res) {
    let response = await OrderService.getOrderById(req.params.id);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }

  async updateOrder(req, res) {
    const response = await OrderService.updateOrder(req.body._id, req.body);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }

  async deleteOrder(req, res) {
    const response = await OrderService.deleteOrder(req.body._id);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }

  async updateOrderStatus(req, res) {
    try {
        const order = await this.orderService.getOrderById(req.params.orderId);
        if (!order) {
          return res.status(404).send({ error: 'Order not found' });
        }
  
        const { status } = req.body;
        order.status = status;
  
        const updateResponse = await this.orderService.updateOrder(req.params.orderId, order);
  
        if (updateResponse.error) {
          return res.status(updateResponse.statusCode).send(updateResponse);
        }
  
        res.send(order);
      } catch (err) {
        res.status(500).send(err);
  }
}
}
module.exports = new OrderController(orderService);

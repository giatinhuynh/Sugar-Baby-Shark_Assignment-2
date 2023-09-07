var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
const Order = mongoose.model('Order');




  // Create a new order
  router.post('/post', async (req, res) => {
    const { customerId, distributionHubId, products, totalPrice } = req.body;

    const order = new Order({
      customerId,
      distributionHubId,
      products,
      totalPrice,
      status: 'active'
    });

    try {
      await order.save();
      res.status(201).send({ order });
    } catch (err) {
      res.status(400).send(err);
    }
  });

  // View all orders for a specific shipper
  router.get('/shipper/:shipperId', async (req, res) => {
    try {
      const orders = await Order.find({ shipperId: req.params.shipperId, status: 'active' }).populate('products.productId');
      res.send(orders);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  // Update the status of an order
  router.put('/:orderId', async (req, res) => {
    try {
      const order = await Order.findById(req.params.orderId);
      if (!order) {
        return res.status(404).send({ error: 'Order not found' });
      }

      const { status } = req.body;
      order.status = status;

      await order.save();
      res.send(order);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  module.exports = router;
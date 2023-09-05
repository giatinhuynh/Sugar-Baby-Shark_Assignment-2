const mongoose = require('mongoose');
const Order = mongoose.model('Order');

module.exports = (app) => {

  // Create a new order
  app.post('/api/orders', async (req, res) => {
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
  app.get('/api/orders/shipper/:shipperId', async (req, res) => {
    try {
      const orders = await Order.find({ shipperId: req.params.shipperId, status: 'active' }).populate('products.productId');
      res.send(orders);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  // Update the status of an order
  app.put('/api/orders/:orderId', async (req, res) => {
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
};

// routes/shipperRoutes.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const Shipper = mongoose.model('Shipper');
const DistributionHub = mongoose.model('DistributionHub');
const NodeCache = require('node-cache');
const myCache = new NodeCache();

module.exports = (app) => {
  // Middleware for authentication
  const auth = async (req, res, next) => {
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

  // Register a new shipper
  app.post('/api/shippers/register', [
    check('username').isLength({ min: 8, max: 15 }).isAlphanumeric(),
    check('password').isLength({ min: 8, max: 20 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/),
    check('distributionHubId').not().isEmpty()
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, distributionHubId } = req.body;

    // Verify if the distribution hub exists
    const hub = await DistributionHub.findById(distributionHubId);
    if (!hub) {
      return res.status(404).json({ message: 'Distribution hub not found' });
    }

    const shipper = new Shipper({
      username,
      password,
      distributionHubId
    });

    try {
      await shipper.save();
      const token = jwt.sign({ _id: shipper._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(201).send({ shipper, token });
    } catch (err) {
      res.status(400).send(err);
    }
  });

   // Login a shipper
   app.post('/api/shippers/login', async (req, res) => {
    const { username, password } = req.body;
    const shipper = await Shipper.findOne({ username });
    if (!shipper) {
      return res.status(401).send({ error: 'Login failed' });
    }
    const isPasswordMatch = await bcrypt.compare(password, shipper.password);
    if (!isPasswordMatch) {
      return res.status(401).send({ error: 'Login failed' });
    }
    const token = jwt.sign({ _id: shipper._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.send({ shipper, token });
  });

  // Logout a shipper
  app.post('/api/shippers/logout', auth, (req, res) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    myCache.set(token, true, 60 * 60 * 24);  // Blacklist this token for 24 hours
    res.send({ success: true });
  });

  // Shipper can see all active orders at their distribution hub
  app.get('/api/shippers/orders', auth, async (req, res) => {
    const orders = await Order.find({ distributionHubId: req.shipper.distributionHubId, status: 'active' });
    res.send(orders);
  });

  // Shipper can update the status of an order
  app.put('/api/shippers/orders/:orderId', auth, async (req, res) => {
    const { status } = req.body;
    const order = await Order.findOne({ _id: req.params.orderId, distributionHubId: req.shipper.distributionHubId });
    if (!order) {
      return res.status(404).send({ error: 'Order not found' });
    }
    order.status = status;
    await order.save();
    res.send(order);
  });
};

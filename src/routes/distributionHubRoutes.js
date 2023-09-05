const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const DistributionHub = mongoose.model('DistributionHub');

module.exports = (app) => {

  // Add a new distribution hub
  app.post('/api/distributionHubs', [
    check('name').isLength({ min: 1 }),
    check('address').isLength({ min: 1 })
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, address } = req.body;

    const distributionHub = new DistributionHub({
      name,
      address
    });

    try {
      await distributionHub.save();
      res.status(201).send({ distributionHub });
    } catch (err) {
      res.status(400).send(err);
    }
  });

  // View all distribution hubs
  app.get('/api/distributionHubs', async (req, res) => {
    try {
      const distributionHubs = await DistributionHub.find();
      res.send(distributionHubs);
    } catch (err) {
      res.status(500).send(err);
    }
  });
};

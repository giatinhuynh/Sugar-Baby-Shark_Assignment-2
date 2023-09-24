/* // RMIT University Vietnam
// Course: COSC2430 Web Programming
// Semester: 2023B
// Assessment: Assignment 2
// Author: Huynh Duc Gia Tin, Tran Ha Phuong, Nguyen Viet Ha, Phan Nhat Minh, Tran Nguyen Quoc An
// ID: s3962053, s3979638, s3978128, s3959931, s3978598 
// Acknowledgement: MDN Web Docs, Youtube, W3school, GeeksforGeeks, RMIT Canvas, ChatGPT, NPM Packages' Docs */

var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const DistributionHub = require('../models/DistributionHub');



  // Add a new distribution hub
  router.post('/post', [
    check('name').isLength({ min: 5 }),  // Updated minimum length to 5
    check('address').isLength({ min: 5 })  // Updated minimum length to 5
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
  router.get('/get', async (req, res) => {
    try {
      const distributionHubs = await DistributionHub.find();
      res.send(distributionHubs);
    } catch (err) {
      res.status(500).send(err);
    }
  });

module.exports = router;

/* // RMIT University Vietnam
// Course: COSC2430 Web Programming
// Semester: 2023B
// Assessment: Assignment 2
// Author: Huynh Duc Gia Tin, Tran Ha Phuong, Nguyen Viet Ha, Phan Nhat Minh, Tran Nguyen Quoc An
// ID: s3962053, s3979638, s3978128, s3959931, s3978598 
// Acknowledgement: MDN Web Docs, Youtube, W3school, GeeksforGeeks, RMIT Canvas, ChatGPT, NPM Packages' Docs */

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');



// get all orders
router.get('/get', orderController.getOrders);
// Update the status of an order
router.put('/:id', orderController.updateOrderStatus);

// get Order details
router.get('/:id', orderController.getOrderById);

// Create a new order
router.post('/create', orderController.createOrder);

module.exports = router;

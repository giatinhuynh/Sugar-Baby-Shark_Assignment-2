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
router.post('/post', orderController.createOrder);

module.exports = router;

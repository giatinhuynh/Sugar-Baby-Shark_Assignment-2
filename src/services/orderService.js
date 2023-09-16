const Service = require('./Service');
const Order = require('../models/Order');

class OrderService extends Service {
  constructor() {
    super(Order);
  }

  async createOrder(orderData) {
    try {
      const order = new Order(orderData);
      const savedOrder = await order.save();
      return {
        error: false,
        statusCode: 201,
        data: savedOrder,
      };
    } catch (error) {
      return {
        error: true,
        statusCode: 500,
        message: 'Failed to create Order',
        errors: error,
      };
    }
  }

  async getOrderById(id) {
    return await this.getById(id);
  }

  async getOrders() {
    try {
      const orders = await this.getAll();
      return {
        error: false,
        statusCode: 200,
        data: orders,
      };
    } catch (error) {
      return {
        error: true,
        statusCode: 500,
        message: 'Failed to fetch orders',
        errors: error,
      };
    }
  }

  async updateOrder(id, orderData) {
    try {
      const updatedOrder = await this.update(id, orderData);
      if (!updatedOrder) {
        return {
          error: true,
          statusCode: 404,
          message: 'Order not found',
        };
      }
      return {
        error: false,
        statusCode: 200,
        data: updatedOrder,
      };
    } catch (error) {
      return {
        error: true,
        statusCode: 500,
        message: 'Failed to update Order',
        errors: error,
      };
    }
  }

  async deleteOrder(id) {
    try {
      const deletedOrder = await this.delete(id);
      if (!deletedOrder) {
        return {
          error: true,
          statusCode: 404,
          message: 'Order not found',
        };
      }
      return {
        error: false,
        statusCode: 200,
        message: 'Order deleted successfully',
      };
    } catch (error) {
      return {
        error: true,
        statusCode: 500,
        message: 'Failed to delete Order',
        errors: error,
      };
    }
  }
}

module.exports = OrderService;

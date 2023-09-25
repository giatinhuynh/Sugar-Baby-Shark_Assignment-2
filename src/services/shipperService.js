/* // RMIT University Vietnam
// Course: COSC2430 Web Programming
// Semester: 2023B
// Assessment: Assignment 2
// Author: Huynh Duc Gia Tin, Tran Ha Phuong, Nguyen Viet Ha, Phan Nhat Minh, Tran Nguyen Quoc An
// ID: s3962053, s3979638, s3978128, s3959931, s3978598 
// Acknowledgement: MDN Web Docs, Youtube, W3school, GeeksforGeeks, RMIT Canvas, ChatGPT, NPM Packages' Docs */

const Service = require('./Service');
const Shipper = require('../models/Shipper');

class ShipperService extends Service {
  constructor() {
    super(Shipper);
  }

  async createShipper(shipperData) {
    try {
      const shipper = new Shipper(shipperData);
      const savedShipper = await shipper.save();
      return {
        error: false,
        statusCode: 201,
        data: savedShipper,
      };
    } catch (error) {
      return {
        error: true,
        statusCode: 500,
        message: 'Failed to create Shipper',
        errors: error,
      };
    }
  }

  async getShipperById(id) {
    return await this.getById(id);
  }

  async getShippers() {
    try {
      const shippers = await this.getAll();
      return {
        error: false,
        statusCode: 200,
        data: shippers,
      };
    } catch (error) {
      return {
        error: true,
        statusCode: 500,
        message: 'Failed to fetch shippers',
        errors: error,
      };
    }
  }

  async updateShipper(id, shipperData) {
    try {
      const updatedShipper = await this.update(id, shipperData);
      if (!updatedShipper) {
        return {
          error: true,
          statusCode: 404,
          message: 'Shipper not found',
        };
      }
      return {
        error: false,
        statusCode: 200,
        data: updatedShipper,
      };
    } catch (error) {
      return {
        error: true,
        statusCode: 500,
        message: 'Failed to update Shipper',
        errors: error,
      };
    }
  }

  async deleteShipper(id) {
    try {
      const deletedShipper = await this.delete(id);
      if (!deletedShipper) {
        return {
          error: true,
          statusCode: 404,
          message: 'Shipper not found',
        };
      }
      return {
        error: false,
        statusCode: 200,
        message: 'Shipper deleted successfully',
      };
    } catch (error) {
      return {
        error: true,
        statusCode: 500,
        message: 'Failed to delete Shipper',
        errors: error,
      };
    }
  }
}

module.exports = ShipperService;

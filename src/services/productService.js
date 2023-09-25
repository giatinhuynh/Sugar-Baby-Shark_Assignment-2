/* // RMIT University Vietnam
// Course: COSC2430 Web Programming
// Semester: 2023B
// Assessment: Assignment 2
// Author: Huynh Duc Gia Tin, Tran Ha Phuong, Nguyen Viet Ha, Phan Nhat Minh, Tran Nguyen Quoc An
// ID: s3962053, s3979638, s3978128, s3959931, s3978598 
// Acknowledgement: MDN Web Docs, Youtube, W3school, GeeksforGeeks, RMIT Canvas, ChatGPT, NPM Packages' Docs */

const Service = require('./Service');
const Product = require('../models/Product');

class ProductService extends Service {
  constructor() {
    super(Product);
  }

  async createProduct(productData) {
    try {
      
      const product = new Product(productData);
      const savedProduct = await product.save();
      return {
        error: false,
        statusCode: 201,
        data: savedProduct,
      };
    } catch (error) {
      return {
        error: true,
        statusCode: 500,
        message: 'Failed to create product',
        errors: error,
      };
    }
  }

  async getProductById(id){
    return await this.getById(id);
  }
  async getProducts() {
    try {
      const products = await this.getAll();
      return {
        error: false,
        statusCode: 200,
        data: products,
      };
    } catch (error) {
      return {
        error: true,
        statusCode: 500,
        message: 'Failed to fetch products',
        errors: error,
      };
    }
  }

  async updateProduct(id, productData) {
    try {
      const updatedProduct = await this.update(id, productData);
      if (!updatedProduct) {
        return {
          error: true,
          statusCode: 404,
          message: 'Product not found',
        };
      }
      return {
        error: false,
        statusCode: 200,
        data: updatedProduct,
      };
    } catch (error) {
      return {
        error: true,
        statusCode: 500,
        message: 'Failed to update product',
        errors: error,
      };
    }
  }

  async deleteProduct(id) {
    try {
      const deletedProduct = await this.delete(id);
      if (!deletedProduct) {
        return {
          error: true,
          statusCode: 404,
          message: 'Product not found',
        };
      }
      return {
        error: false,
        statusCode: 200,
        message: 'Product deleted successfully',
      };
    } catch (error) {
      return {
        error: true,
        statusCode: 500,
        message: 'Failed to delete product',
        errors: error,
      };
    }
  }
}

module.exports = ProductService;

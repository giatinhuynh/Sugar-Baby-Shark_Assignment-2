/* // RMIT University Vietnam
// Course: COSC2430 Web Programming
// Semester: 2023B
// Assessment: Assignment 2
// Author: Huynh Duc Gia Tin, Tran Ha Phuong, Nguyen Viet Ha, Phan Nhat Minh, Tran Nguyen Quoc An
// ID: s3962053, s3979638, s3978128, s3959931, s3978598 
// Acknowledgement: MDN Web Docs, Youtube, W3school, GeeksforGeeks, RMIT Canvas, ChatGPT, NPM Packages' Docs */

class Service {
    constructor(model) {
      this.model = model;
    }
  
    async getAll() {
      try {
        const items = await this.model.find();
        console.log(items);
        let total = await this.model.count();
        return { error: false, statusCode: 200, data: items, total: total };
      } catch (error) {
        return { error: true, statusCode: 500, errors: error };
      }
    }
  
    async insert(data) {
      try {
        const newItem = new this.model(data);
        const savedItem = await newItem.save();
        return { error: false, statusCode: 201, data: savedItem };
      } catch (error) {
        return { error: true, statusCode: 500, errors: error };
      }
    }
  
    async update(id, data) {
      try {
        const updatedItem = await this.model.findByIdAndUpdate(id, data, { new: true });
        if (!updatedItem) {
          return { error: true, statusCode: 404, message: "Item not found" };
        }
        return { error: false, statusCode: 200, data: updatedItem };
      } catch (error) {
        return { error: true, statusCode: 500, errors: error };
      }
    }
  
    async delete(id) {
      try {
        const deletedItem = await this.model.findByIdAndRemove(id);
        if (!deletedItem) {
          return { error: true, statusCode: 404, message: "Item not found" };
        }
        return { error: false, statusCode: 200, message: "Item deleted successfully" };
      } catch (error) {
        return { error: true, statusCode: 500, errors: error };
      }
    }

    async getById(id) {
      try {
        let item = await this.model.findById(id);
        if (!item) {
          return {
            error: true,
            statusCode: 404,
            message: "Item not found"
          };
        }
    
        return {
          error: false,
          statusCode: 200,
          data: item
        };
      } catch (error) {
        return {
          error: true,
          statusCode: 500,
          errors: error
        };
      }
    }
  }
  
  module.exports = Service;
  
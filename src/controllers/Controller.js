/* // RMIT University Vietnam
// Course: COSC2430 Web Programming
// Semester: 2023B
// Assessment: Assignment 2
// Author: Huynh Duc Gia Tin, Tran Ha Phuong, Nguyen Viet Ha, Phan Nhat Minh, Tran Nguyen Quoc An
// ID: s3962053, s3979638, s3978128, s3959931, s3978598 
// Acknowledgement: MDN Web Docs, Youtube, W3school, GeeksforGeeks, RMIT Canvas, ChatGPT, NPM Packages' Docs */

class Controller {
    constructor(service) {
      this.service = service;
    }
  
    async getAll(req, res) {
      const response = await this.service.getAll(req.query);
      res.status(response.statusCode).send(response);
    }
  
    async insert(req, res) {
      const response = await this.service.insert(req.body);
      res.status(response.statusCode).send(response);
    }
  
    async update(req, res) {
      const { id } = req.params;
      const response = await this.service.update(id, req.body);
      res.status(response.statusCode).send(response);
    }
  
    async delete(req, res) {
      const { id } = req.params;
      const response = await this.service.delete(id);
      res.status(response.statusCode).send(response);
    }
  }
  
  module.exports = Controller;
  
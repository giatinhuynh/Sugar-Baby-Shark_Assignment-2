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
  
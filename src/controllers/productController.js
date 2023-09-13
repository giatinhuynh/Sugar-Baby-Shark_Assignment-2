const mongoose = require("mongoose");
const productService = require("../services/productService");
const Controller = require("./Controller");
const service = require("../models/Product");

const product = mongoose.model("Product");
const ProductService = new productService(product);

class ProductController extends Controller {
  constructor(service) {
    super(service);
  }

  async createProduct(req, res) {
    const response = await ProductService.createProduct(req.body);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }

  async getProducts(req, res) {
    const response = await ProductService.getProducts();
    console.log(response);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
   
  }
  async getProductById(req, res){
    let response = await ProductService.getProductById(req.params.id);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
}
  async updateProduct(req, res) {
    const response = await ProductService.updateProduct(req.body._id, req.body);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }

  async deleteProduct(req, res) {
    const response = await ProductService.deleteProduct(req.body._id);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }


}

module.exports = new ProductController(productService);

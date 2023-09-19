const mongoose = require("mongoose");
const productService = require("../services/productService");
const Controller = require("./Controller");


const product = mongoose.model("Product");
const ProductService = new productService(product);
const { check, validationResult } = require('express-validator');
class ProductController extends Controller {
  constructor(service) {
    super(service);
  }

  async createProduct(req, res) {
    check('name').isLength({ min: 10, max: 20 }),
        check('price').isFloat({ min: 0 }),
       check('description').isLength({ max: 500 })
      , async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ message: 'Validation errors', errors: errors.array() });
        }
        console.log('Request body');
    console.log(req.body);
        const { name, price, image, description } = req.body;
        const vendorId = req.body.vendor; // Assuming the vendor's ID is stored in req.vendor by your auth middleware
        
        // Verify if vendor exists
        const vendor = await Vendor.findById(vendorId);
      
        if (!vendor) {
          return res.status(404).json({ message: 'Vendor not found' });
        }
    
        const product = new Product({
          name,
          price,
          image,
          description,
          vendor: vendorId
        });
    const response = await ProductService.createProduct(product);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }
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
    return res.render('productDetail', { product: response.data });
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

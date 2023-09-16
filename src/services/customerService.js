const Service = require('./Service');
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const productService = require('./productService');
const ProductService = new productService(Product);

class CustomerService extends Service {
  constructor() {
    super(Customer);
  }

  async createCustomer(customerData) {
    try {
      
      const customer = new Customer(customerData);
      const savedCustomer = await customer.save();
      return {
        error: false,
        statusCode: 201,
        data: savedCustomer,
      };
    } catch (error) {
      return {
        error: true,
        statusCode: 500,
        message: 'Failed to create Customer',
        errors: error,
      };
    }
  }

  async getCustomerById(id){
    return await this.getById(id);
  }
  async getCustomers() {
    try {
      const customers = await this.getAll();
      return {
        error: false,
        statusCode: 200,
        data: customers,
      };
    } catch (error) {
      return {
        error: true,
        statusCode: 500,
        message: 'Failed to fetch customers',
        errors: error,
      };
    }
  }

  async updateCustomer(id, customerData) {
    try {
      const updatedCustomer = await this.update(id, customerData);
      if (!updatedCustomer) {
        return {
          error: true,
          statusCode: 404,
          message: 'Customer not found',
        };
      }
      return {
        error: false,
        statusCode: 200,
        data: updatedCustomer,
      };
    } catch (error) {
      return {
        error: true,
        statusCode: 500,
        message: 'Failed to update Customer',
        errors: error,
      };
    }
  }

  async deleteCustomer(id) {
    try {
      const deletedCustomer = await this.delete(id);
      if (!deletedCustomer) {
        return {
          error: true,
          statusCode: 404,
          message: 'Customer not found',
        };
      }
      return {
        error: false,
        statusCode: 200,
        message: 'Customer deleted successfully',
      };
    } catch (error) {
      return {
        error: true,
        statusCode: 500,
        message: 'Failed to delete Customer',
        errors: error,
      };
    }
  }

  async addToCart(customerId, productId, quantity) {
    try {
      // Retrieve the customer from the database
      const customer = await this.getById(customerId);
  console.log(customer.data);
  
      if (!customer) {
        return {
          error: true,
          statusCode: 404,
          message: 'Customer not found',
        };
      }
     
      // Check if the product exists 
      const product = await ProductService.getProductById(productId);
      
      if (!product) {
        return {
          error: true,
          statusCode: 404,
          message: 'Product not found',
        };
      }
    //   if (!customer.shoppingCart) {
    //     customer.shoppingCart = [];
    //   }

    // Find the cart item with the same productId
    const existingCartItem = customer.data.shoppingCart.find(
        (item) => item.productId.toString() == productId.toString()
      );
  console.log(existingCartItem);
      if (existingCartItem) {
        // Update the quantity if the product already exists in the cart
        existingCartItem.quantity += quantity;
      } else {
        // Create a new cart item if the product doesn't exist in the cart
        const cartItem = {
          productId,
          quantity,
        };
  
        // Add the cart item to the customer's shopping cart
        customer.data.shoppingCart.push(cartItem);
      }

      // Add the cart item to the customer's shopping cart
     
      console.log("shoppingCart")
      console.log(customer.data.shoppingCart);
  
      // Save the updated customer data to the database
      await this.updateCustomer(customerId, customer.data);
  
      return {
        error: false,
        statusCode: 200,
        message: 'Product added to cart successfully',
      };
    } catch (error) {

        console.error('Error adding product to cart:', error);

      return {
        error: true,
        statusCode: 500,
        message: 'Failed to add product to cart',
        errors: error,
      };
    }
  }
}

module.exports = CustomerService;

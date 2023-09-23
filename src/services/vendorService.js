const Service = require('./Service');
const Vendor = require('../models/Vendor');

class VendorService extends Service {
  constructor() {
    super(Vendor);
  }

  async createVendor(vendorData) {
    try {
      const vendor = new Vendor(vendorData);
      const savedVendor = await vendor.save();
      return {
        error: false,
        statusCode: 201,
        data: savedVendor,
      };
    } catch (error) {
      return {
        error: true,
        statusCode: 500,
        message: 'Failed to create Vendor',
        errors: error,
      };
    }
  }

  async getVendorById(id) {
    return await this.getById(id);
  }

  async getVendors() {
    try {
      const vendors = await this.getAll();
      return {
        error: false,
        statusCode: 200,
        data: vendors,
      };
    } catch (error) {
      return {
        error: true,
        statusCode: 500,
        message: 'Failed to fetch vendors',
        errors: error,
      };
    }
  }

  async updateVendor(id, vendorData) {
    
    try {  console.log(vendorData);
      const updatedVendor = await this.update(id, vendorData);
    
      if (!updatedVendor) {
        return {
          error: true,
          statusCode: 404,
          message: 'Vendor not found',
        };
      }
      return {
        error: false,
        statusCode: 200,
        data: updatedVendor,
      };
    } catch (error) {
      return {
        error: true,
        statusCode: 500,
        message: 'Failed to update Vendor',
        errors: error,
      };
    }
  }

  async deleteVendor(id) {
    try {
      const deletedVendor = await this.delete(id);
      if (!deletedVendor) {
        return {
          error: true,
          statusCode: 404,
          message: 'Vendor not found',
        };
      }
      return {
        error: false,
        statusCode: 200,
        message: 'Vendor deleted successfully',
      };
    } catch (error) {
      return {
        error: true,
        statusCode: 500,
        message: 'Failed to delete Vendor',
        errors: error,
      };
    }
  }
}

module.exports = VendorService;

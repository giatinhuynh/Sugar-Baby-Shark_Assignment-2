const Service = require('./Service');
const DistributionHub = require('../models/DistributionHub');

class DistributionHubService extends Service {
  constructor() {
    super(DistributionHub);
  }

  async createDistributionHub(distributionHubData) {
    try {
      const distributionHub = new DistributionHub(distributionHubData);
      const savedDistributionHub = await distributionHub.save();
      return {
        error: false,
        statusCode: 201,
        data: savedDistributionHub,
      };
    } catch (error) {
      return {
        error: true,
        statusCode: 500,
        message: 'Failed to create DistributionHub',
        errors: error,
      };
    }
  }

  async getDistributionHubById(id) {
    return await this.getById(id);
  }

  async getDistributionHubs() {
    try {
      const distributionHubs = await this.getAll();
      return {
        error: false,
        statusCode: 200,
        data: distributionHubs,
      };
    } catch (error) {
      return {
        error: true,
        statusCode: 500,
        message: 'Failed to fetch DistributionHubs',
        errors: error,
      };
    }
  }

  async updateDistributionHub(id, distributionHubData) {
    try {
      const updatedDistributionHub = await this.update(id, distributionHubData);
      if (!updatedDistributionHub) {
        return {
          error: true,
          statusCode: 404,
          message: 'DistributionHub not found',
        };
      }
      return {
        error: false,
        statusCode: 200,
        data: updatedDistributionHub,
      };
    } catch (error) {
      return {
        error: true,
        statusCode: 500,
        message: 'Failed to update DistributionHub',
        errors: error,
      };
    }
  }

  async deleteDistributionHub(id) {
    try {
      const deletedDistributionHub = await this.delete(id);
      if (!deletedDistributionHub) {
        return {
          error: true,
          statusCode: 404,
          message: 'DistributionHub not found',
        };
      }
      return {
        error: false,
        statusCode: 200,
        message: 'DistributionHub deleted successfully',
      };
    } catch (error) {
      return {
        error: true,
        statusCode: 500,
        message: 'Failed to delete DistributionHub',
        errors: error,
      };
    }
  }
}

module.exports = DistributionHubService;

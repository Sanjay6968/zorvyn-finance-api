const dashboardService = require('../services/dashboard.service');
const { successResponse } = require('../utils/response.util');

const getSummary = async (req, res, next) => {
  try {
    const data = await dashboardService.getSummary();
    return successResponse(res, {
      message: 'Dashboard summary retrieved',
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getCategoryBreakdown = async (req, res, next) => {
  try {
    const data = await dashboardService.getCategoryBreakdown();
    return successResponse(res, {
      message: 'Category breakdown retrieved',
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getMonthlyTrends = async (req, res, next) => {
  try {
    const months = parseInt(req.query.months) || 12;
    const data = await dashboardService.getMonthlyTrends(months);
    return successResponse(res, {
      message: `Monthly trends for last ${months} months`,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getRecentTransactions = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const data = await dashboardService.getRecentTransactions(limit);
    return successResponse(res, {
      message: 'Recent transactions retrieved',
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getTopCategories = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const data = await dashboardService.getTopCategories(limit);
    return successResponse(res, {
      message: 'Top spending categories retrieved',
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSummary,
  getCategoryBreakdown,
  getMonthlyTrends,
  getRecentTransactions,
  getTopCategories,
};

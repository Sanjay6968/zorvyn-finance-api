const express = require('express');
const router = express.Router();
const {
  getSummary,
  getCategoryBreakdown,
  getMonthlyTrends,
  getRecentTransactions,
  getTopCategories,
} = require('../controllers/dashboard.controller');
const { authenticate } = require('../middleware/auth');
const { isAnalyst, isViewer } = require('../middleware/rbac');


router.get('/summary', authenticate, isAnalyst, getSummary);

router.get('/categories', authenticate, isAnalyst, getCategoryBreakdown);

router.get('/trends', authenticate, isAnalyst, getMonthlyTrends);

router.get('/recent', authenticate, isViewer, getRecentTransactions);

router.get('/top-categories', authenticate, isAnalyst, getTopCategories);

module.exports = router;

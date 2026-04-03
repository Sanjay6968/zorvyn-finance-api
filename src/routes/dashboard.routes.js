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

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard analytics and summaries
 *
 * /dashboard/summary:
 *   get:
 *     summary: Get dashboard summary (income, expenses, balance)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Summary retrieved
 * /dashboard/categories:
 *   get:
 *     summary: Get category-wise breakdown
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Breakdown retrieved
 * /dashboard/trends:
 *   get:
 *     summary: Get monthly income vs expenses trends
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trends retrieved
 * /dashboard/recent:
 *   get:
 *     summary: Get recent transactions
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recent transactions
 * /dashboard/top-categories:
 *   get:
 *     summary: Get top spending categories
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Top categories
 */

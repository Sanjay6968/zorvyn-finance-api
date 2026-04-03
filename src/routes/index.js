const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const recordRoutes = require('./record.routes');
const dashboardRoutes = require('./dashboard.routes');

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Finance API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

router.use('/auth', authRoutes);
router.use('/records', recordRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;

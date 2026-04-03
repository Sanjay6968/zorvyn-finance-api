require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const routes = require('./routes/index');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');
const { requestLogger } = require('./middleware/logger');

const app = express();


const BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;

// Security middleware
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Logger
app.use(requestLogger);

// Rate limiter
app.use('/api', apiLimiter);

// Swagger Docs
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Finance API Docs',
    swaggerOptions: {
      persistAuthorization: true,
    },
  })
);

// API Routes
app.use('/api/v1', routes);

// Root Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Finance Data Processing & Access Control API',
    version: '1.0.0',
    docs: `${BASE_URL}/api-docs`,
    health: `${BASE_URL}/api/v1/health`,
  });
});

// 404 Handler
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

module.exports = app;

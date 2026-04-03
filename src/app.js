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

app.use(helmet());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(requestLogger);

app.use('/api', apiLimiter);

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

app.use('/api/v1', routes);

app.get('/', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  res.status(200).json({
    success: true,
    message: ' Finance Data Processing & Access Control API',
    version: '1.0.0',
    docs: `${baseUrl}/api-docs`,
    health: `${baseUrl}/api/v1/health`,
  });
});

app.use(notFound);

app.use(errorHandler);

module.exports = app;

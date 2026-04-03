require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');
const logger = require('./src/utils/logger.util');

const PORT = process.env.PORT || 5000;


const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
      logger.info(`API Docs: ${BASE_URL}/api-docs`);
      logger.info(` Health:   ${BASE_URL}/api/v1/health`);
    });

    const shutdown = (signal) => {
      logger.warn(`${signal} received. Gracefully shutting down...`);
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
      server.close(() => process.exit(1));
    });

  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();

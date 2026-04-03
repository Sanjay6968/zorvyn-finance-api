const morgan = require('morgan');
const logger = require('../utils/logger.util');

const morganStream = {
  write: (message) => logger.http(message.trim()),
};

morgan.token('user-id', (req) => req.user?.id || 'anonymous');
morgan.token('body', (req) => {
  const body = { ...req.body };
  if (body.password) body.password = '[REDACTED]';
  if (body.confirmPassword) body.confirmPassword = '[REDACTED]';
  return JSON.stringify(body);
});

const requestLogger = morgan(
  ':method :url :status :response-time ms — user::user-id',
  { stream: morganStream }
);

module.exports = { requestLogger };

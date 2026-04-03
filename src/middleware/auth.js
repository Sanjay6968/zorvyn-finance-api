const { verifyToken } = require('../utils/jwt.util');
const { errorResponse } = require('../utils/response.util');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return errorResponse(res, {
        statusCode: 401,
        message: 'Access denied. No token provided.',
      });
    }

    const decoded = verifyToken(token);

    const user = await User.findById(decoded.id).select('+passwordChangedAt');
    if (!user) {
      return errorResponse(res, {
        statusCode: 401,
        message: 'User belonging to this token no longer exists.',
      });
    }

    if (!user.isActive) {
      return errorResponse(res, {
        statusCode: 403,
        message: 'Your account has been deactivated. Contact an administrator.',
      });
    }

    if (user.changedPasswordAfter(decoded.iat)) {
      return errorResponse(res, {
        statusCode: 401,
        message: 'Password was recently changed. Please log in again.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, { statusCode: 401, message: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, { statusCode: 401, message: 'Token expired. Please log in again.' });
    }
    next(error);
  }
};

module.exports = { authenticate };

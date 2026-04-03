const { errorResponse } = require('../utils/response.util');

const ROLE_PERMISSIONS = {
  admin: ['viewer', 'analyst', 'admin'],   
  analyst: ['viewer', 'analyst'],
  viewer: ['viewer'],
};

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, { statusCode: 401, message: 'Authentication required.' });
    }

    const userRole = req.user.role;

    const hasPermission = allowedRoles.some((role) =>
      ROLE_PERMISSIONS[userRole]?.includes(role)
    );

    if (!hasPermission) {
      return errorResponse(res, {
        statusCode: 403,
        message: `Access forbidden. Required role(s): ${allowedRoles.join(', ')}. Your role: ${userRole}.`,
      });
    }

    next();
  };
};

const isAdmin = authorize('admin');
const isAnalyst = authorize('analyst');      
const isViewer = authorize('viewer');        

module.exports = { authorize, isAdmin, isAnalyst, isViewer, ROLE_PERMISSIONS };

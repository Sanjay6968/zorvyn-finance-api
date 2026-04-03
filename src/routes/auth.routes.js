const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  assignRole,
  activateUser,
  deactivateUser,
  getAllUsers,
} = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth');
const { isAdmin } = require('../middleware/rbac');
const { authLimiter } = require('../middleware/rateLimiter');
const {
  validateRegister,
  validateLogin,
  validateAssignRole,
} = require('../validators/auth.validator');


router.post('/register', authLimiter, validateRegister, register);

router.post('/login', authLimiter, validateLogin, login);

router.get('/me', authenticate, getProfile);


router.get('/users', authenticate, isAdmin, getAllUsers);

router.patch('/users/:id/role', authenticate, isAdmin, validateAssignRole, assignRole);

router.patch('/users/:id/activate', authenticate, isAdmin, activateUser);

router.patch('/users/:id/deactivate', authenticate, isAdmin, deactivateUser);

module.exports = router;

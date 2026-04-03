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

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication and management
 *
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               role: { type: string }
 *     responses:
 *       201:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SuccessResponse' }
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SuccessResponse' }
 * /auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved
 * /auth/users:
 *   get:
 *     summary: List all users
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved
 * /auth/users/{id}/role:
 *   patch:
 *     summary: Assign a role to a user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role: { type: string }
 *     responses:
 *       200:
 *         description: Role assigned
 * /auth/users/{id}/activate:
 *   patch:
 *     summary: Activate a user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User activated
 * /auth/users/{id}/deactivate:
 *   patch:
 *     summary: Deactivate a user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User deactivated
 */

const User = require('../models/User');
const { generateToken } = require('../utils/jwt.util');
const logger = require('../utils/logger.util');

class AuthService {
  async register({ name, email, password, role }) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error('Email already registered');
      error.statusCode = 409;
      throw error;
    }

    const user = await User.create({ name, email, password, role: role || 'viewer' });

    const token = generateToken({ id: user._id, role: user.role });

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    };
  }

  async login({ email, password }) {
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    if (!user.isActive) {
      const error = new Error('Account deactivated. Contact an administrator.');
      error.statusCode = 403;
      throw error;
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken({ id: user._id, role: user.role });

    logger.info(`User logged in: ${user.email} (${user.role})`);

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin,
      },
    };
  }

  async assignRole(userId, role) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    user.role = role;
    await user.save({ validateBeforeSave: false });

    logger.info(`Role assigned: ${user.email} → ${role}`);

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  async setUserStatus(userId, isActive) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    user.isActive = isActive;
    await user.save({ validateBeforeSave: false });

    const action = isActive ? 'activated' : 'deactivated';
    logger.info(`User ${action}: ${user.email}`);

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    };
  }

  async getAllUsers({ page, limit, skip }) {
    const [users, total] = await Promise.all([
      User.find().select('-__v').sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(),
    ]);
    return { users, total };
  }

  async getProfile(userId) {
    const user = await User.findById(userId).select('-__v');
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }
}

module.exports = new AuthService();

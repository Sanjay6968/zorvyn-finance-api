const authService = require('../services/auth.service');
const { successResponse } = require('../utils/response.util');
const { paginate } = require('../utils/pagination.util');

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    return successResponse(res, {
      statusCode: 201,
      message: 'Registration successful',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    return successResponse(res, {
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user._id);
    return successResponse(res, {
      message: 'Profile retrieved',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

const assignRole = async (req, res, next) => {
  try {
    const user = await authService.assignRole(req.params.id, req.body.role);
    return successResponse(res, {
      message: `Role updated to '${req.body.role}' successfully`,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

const activateUser = async (req, res, next) => {
  try {
    const user = await authService.setUserStatus(req.params.id, true);
    return successResponse(res, { message: 'User activated successfully', data: { user } });
  } catch (error) {
    next(error);
  }
};

const deactivateUser = async (req, res, next) => {
  try {
    const user = await authService.setUserStatus(req.params.id, false);
    return successResponse(res, { message: 'User deactivated successfully', data: { user } });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const pagination = paginate(req.query);
    const { users, total } = await authService.getAllUsers(pagination);
    return successResponse(res, {
      message: 'Users retrieved',
      data: { users },
      meta: {
        currentPage: pagination.page,
        totalPages: Math.ceil(total / pagination.limit),
        totalRecords: total,
        recordsPerPage: pagination.limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getProfile, assignRole, activateUser, deactivateUser, getAllUsers };

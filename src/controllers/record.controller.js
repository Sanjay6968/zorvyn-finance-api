const recordService = require('../services/record.service');
const { successResponse, paginatedResponse } = require('../utils/response.util');

const createRecord = async (req, res, next) => {
  try {
    const record = await recordService.createRecord(req.body, req.user._id);
    return successResponse(res, {
      statusCode: 201,
      message: 'Financial record created successfully',
      data: { record },
    });
  } catch (error) {
    next(error);
  }
};

const getRecords = async (req, res, next) => {
  try {
    const { records, pagination } = await recordService.getRecords(req.query);
    return paginatedResponse(res, {
      message: 'Records retrieved successfully',
      data: records,
      pagination,
    });
  } catch (error) {
    next(error);
  }
};

const getRecordById = async (req, res, next) => {
  try {
    const record = await recordService.getRecordById(req.params.id);
    return successResponse(res, {
      message: 'Record retrieved successfully',
      data: { record },
    });
  } catch (error) {
    next(error);
  }
};

const updateRecord = async (req, res, next) => {
  try {
    const record = await recordService.updateRecord(req.params.id, req.body, req.user._id);
    return successResponse(res, {
      message: 'Record updated successfully',
      data: { record },
    });
  } catch (error) {
    next(error);
  }
};

const deleteRecord = async (req, res, next) => {
  try {
    const result = await recordService.deleteRecord(req.params.id, req.user._id);
    return successResponse(res, {
      message: result.message,
      data: { id: result.id },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createRecord, getRecords, getRecordById, updateRecord, deleteRecord };

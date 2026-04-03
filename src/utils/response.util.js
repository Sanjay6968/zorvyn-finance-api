
const successResponse = (res, { message = 'Success', data = null, statusCode = 200, meta = null } = {}) => {
  const payload = { success: true, message };
  if (data !== null) payload.data = data;
  if (meta !== null) payload.meta = meta;
  return res.status(statusCode).json(payload);
};

const errorResponse = (res, { message = 'Something went wrong', errors = null, statusCode = 500 } = {}) => {
  const payload = { success: false, message };
  if (errors !== null) payload.errors = errors;
  return res.status(statusCode).json(payload);
};

const paginatedResponse = (res, { message = 'Success', data, pagination }) => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination,
  });
};

module.exports = { successResponse, errorResponse, paginatedResponse };

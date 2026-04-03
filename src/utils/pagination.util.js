const paginate = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const buildPaginationMeta = ({ page, limit, total }) => ({
  currentPage: page,
  totalPages: Math.ceil(total / limit),
  totalRecords: total,
  recordsPerPage: limit,
  hasNextPage: page < Math.ceil(total / limit),
  hasPrevPage: page > 1,
});

module.exports = { paginate, buildPaginationMeta };

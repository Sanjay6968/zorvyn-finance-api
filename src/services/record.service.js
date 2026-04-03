const FinancialRecord = require('../models/FinancialRecord');
const { paginate, buildPaginationMeta } = require('../utils/pagination.util');

class RecordService {
  async createRecord(data, userId) {
    const record = await FinancialRecord.create({
      ...data,
      createdBy: userId,
    });
    return record.populate('createdBy', 'name email');
  }

  async getRecords(queryParams) {
    const { page, limit, skip } = paginate(queryParams);
    const { type, category, startDate, endDate, search, sortBy = 'date', sortOrder = 'desc' } = queryParams;

    const filter = {};

    if (type) filter.type = type;
    if (category) filter.category = { $regex: category, $options: 'i' };
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    if (search) {
      filter.$or = [
        { category: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [records, total] = await Promise.all([
      FinancialRecord.find(filter)
        .populate('createdBy', 'name email')
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .select('-__v'),
      FinancialRecord.countDocuments(filter),
    ]);

    return {
      records,
      pagination: buildPaginationMeta({ page, limit, total }),
    };
  }

  async getRecordById(id) {
    const record = await FinancialRecord.findById(id)
      .populate('createdBy', 'name email')
      .select('-__v');

    if (!record) {
      const error = new Error('Financial record not found');
      error.statusCode = 404;
      throw error;
    }
    return record;
  }

  async updateRecord(id, data, userId) {
    const record = await FinancialRecord.findById(id);
    if (!record) {
      const error = new Error('Financial record not found');
      error.statusCode = 404;
      throw error;
    }

    Object.assign(record, data, { updatedBy: userId });
    await record.save();
    return record.populate('createdBy', 'name email');
  }

  async deleteRecord(id, userId) {
    const record = await FinancialRecord.findById(id);
    if (!record) {
      const error = new Error('Financial record not found');
      error.statusCode = 404;
      throw error;
    }

    record.isDeleted = true;
    record.deletedAt = new Date();
    record.updatedBy = userId;
    await record.save();

    return { message: 'Record deleted successfully', id };
  }
}

module.exports = new RecordService();

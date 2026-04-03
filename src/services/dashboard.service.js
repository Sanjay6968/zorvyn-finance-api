const FinancialRecord = require('../models/FinancialRecord');

class DashboardService {
  async getSummary() {
    const result = await FinancialRecord.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    const income = result.find((r) => r._id === 'income') || { total: 0, count: 0 };
    const expense = result.find((r) => r._id === 'expense') || { total: 0, count: 0 };

    return {
      totalIncome: income.total,
      totalExpenses: expense.total,
      netBalance: income.total - expense.total,
      totalTransactions: income.count + expense.count,
      incomeCount: income.count,
      expenseCount: expense.count,
    };
  }

  async getCategoryBreakdown() {
    const result = await FinancialRecord.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: { category: '$category', type: '$type' },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: '$_id.category',
          breakdown: {
            $push: {
              type: '$_id.type',
              total: '$total',
              count: '$count',
            },
          },
          grandTotal: { $sum: '$total' },
        },
      },
      { $sort: { grandTotal: -1 } },
    ]);

    return result.map((item) => ({
      category: item._id,
      grandTotal: item.grandTotal,
      breakdown: item.breakdown,
    }));
  }

  async getMonthlyTrends(months = 12) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const result = await FinancialRecord.aggregate([
      {
        $match: {
          isDeleted: false,
          date: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type',
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: { year: '$_id.year', month: '$_id.month' },
          data: {
            $push: {
              type: '$_id.type',
              total: '$total',
              count: '$count',
            },
          },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    return result.map((item) => {
      const income = item.data.find((d) => d.type === 'income') || { total: 0, count: 0 };
      const expense = item.data.find((d) => d.type === 'expense') || { total: 0, count: 0 };
      return {
        year: item._id.year,
        month: item._id.month,
        monthName: new Date(item._id.year, item._id.month - 1).toLocaleString('default', { month: 'long' }),
        income: income.total,
        expenses: expense.total,
        net: income.total - expense.total,
        transactionCount: income.count + expense.count,
      };
    });
  }

  async getRecentTransactions(limit = 10) {
    return FinancialRecord.find({ isDeleted: false })
      .populate('createdBy', 'name email')
      .sort({ date: -1 })
      .limit(limit)
      .select('-__v');
  }

  async getTopCategories(limit = 5) {
    return FinancialRecord.aggregate([
      { $match: { isDeleted: false, type: 'expense' } },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          category: '$_id',
          total: 1,
          count: 1,
        },
      },
    ]);
  }
}

module.exports = new DashboardService();

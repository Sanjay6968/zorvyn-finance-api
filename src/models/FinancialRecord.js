const mongoose = require('mongoose');

const financialRecordSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    type: {
      type: String,
      required: [true, 'Type is required'],
      enum: {
        values: ['income', 'expense'],
        message: 'Type must be either income or expense',
      },
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      maxlength: [50, 'Category cannot exceed 50 characters'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

financialRecordSchema.index({ type: 1 });
financialRecordSchema.index({ category: 1 });
financialRecordSchema.index({ date: -1 }); 
financialRecordSchema.index({ createdBy: 1 });
financialRecordSchema.index({ isDeleted: 1 });
financialRecordSchema.index({ type: 1, date: -1, isDeleted: 1 });
financialRecordSchema.index({ category: 1, type: 1, isDeleted: 1 });

financialRecordSchema.pre(/^find/, function (next) {
  if (!this._conditions.hasOwnProperty('isDeleted')) {
    this.where({ isDeleted: false });
  }
  next();
});

module.exports = mongoose.model('FinancialRecord', financialRecordSchema);

const Joi = require('joi');

const createRecordSchema = Joi.object({
  amount: Joi.number().positive().required().messages({
    'number.positive': 'Amount must be a positive number',
    'any.required': 'Amount is required',
  }),
  type: Joi.string().valid('income', 'expense').required().messages({
    'any.only': 'Type must be either income or expense',
    'any.required': 'Type is required',
  }),
  category: Joi.string().min(1).max(50).required().messages({
    'any.required': 'Category is required',
  }),
  date: Joi.date().iso().optional().default(() => new Date()),
  notes: Joi.string().max(500).optional().allow(''),
});

const updateRecordSchema = Joi.object({
  amount: Joi.number().positive().optional(),
  type: Joi.string().valid('income', 'expense').optional(),
  category: Joi.string().min(1).max(50).optional(),
  date: Joi.date().iso().optional(),
  notes: Joi.string().max(500).optional().allow(''),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

const querySchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  type: Joi.string().valid('income', 'expense').optional(),
  category: Joi.string().optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional(),
  search: Joi.string().optional(),
  sortBy: Joi.string().valid('date', 'amount', 'category').optional(),
  sortOrder: Joi.string().valid('asc', 'desc').optional(),
});

const validate = (schema, source = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(
    source === 'body' ? req.body : req.query,
    { abortEarly: false }
  );
  if (error) {
    const errors = error.details.map((d) => d.message);
    return res.status(422).json({ success: false, message: 'Validation failed', errors });
  }
  if (source === 'body') req.body = value;
  else req.query = value;
  next();
};

module.exports = {
  validateCreateRecord: validate(createRecordSchema),
  validateUpdateRecord: validate(updateRecordSchema),
  validateRecordQuery: validate(querySchema, 'query'),
};

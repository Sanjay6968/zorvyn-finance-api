const express = require('express');
const router = express.Router();
const {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
} = require('../controllers/record.controller');
const { authenticate } = require('../middleware/auth');
const { isAdmin, isAnalyst, isViewer } = require('../middleware/rbac');
const {
  validateCreateRecord,
  validateUpdateRecord,
  validateRecordQuery,
} = require('../validators/record.validator');


router.get('/', authenticate, isViewer, validateRecordQuery, getRecords);

router.get('/:id', authenticate, isViewer, getRecordById);

router.post('/', authenticate, isAnalyst, validateCreateRecord, createRecord);

router.put('/:id', authenticate, isAnalyst, validateUpdateRecord, updateRecord);

router.delete('/:id', authenticate, isAdmin, deleteRecord);

module.exports = router;

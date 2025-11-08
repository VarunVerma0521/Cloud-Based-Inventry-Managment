const express = require('express');
const router = express.Router();
const {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} = require('../controllers/supplierController');
const { protect, authorize } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(protect, getSuppliers)
  .post(protect, authorize('admin', 'staff'), createSupplier);

router
  .route('/:id')
  .get(protect, getSupplierById)
  .put(protect, authorize('admin', 'staff'), updateSupplier)
  .delete(protect, authorize('admin', 'staff'), deleteSupplier);

module.exports = router;

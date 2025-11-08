const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(protect, getCategories)
  .post(protect, authorize('admin', 'staff'), createCategory);

router
  .route('/:id')
  .get(protect, getCategoryById)
  .put(protect, authorize('admin', 'staff'), updateCategory)
  .delete(protect, authorize('admin', 'staff'), deleteCategory);

module.exports = router;

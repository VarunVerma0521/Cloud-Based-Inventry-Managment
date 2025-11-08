const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(protect, getProducts)
  .post(protect, authorize('admin', 'staff'), createProduct);

router
  .route('/:id')
  .get(protect, getProductById)
  .put(protect, authorize('admin', 'staff'), updateProduct)
  .delete(protect, authorize('admin', 'staff'), deleteProduct);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getSales,
  getSaleById,
  createSale,
  deleteSale,
  getSalesByDateRange,
} = require('../controllers/saleController');
const { protect, authorize } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(protect, getSales)
  .post(protect, authorize('admin', 'staff'), createSale);

router.route('/filter/daterange').get(protect, getSalesByDateRange);

router
  .route('/:id')
  .get(protect, getSaleById)
  .delete(protect, authorize('admin'), deleteSale);

module.exports = router;

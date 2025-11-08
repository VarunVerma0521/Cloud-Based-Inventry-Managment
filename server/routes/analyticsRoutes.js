const express = require('express');
const router = express.Router();
const {
  getDashboardSummary,
  getMonthlySales,
  getCategoryDistribution,
  getRecentSales,
  getTopProducts,
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/summary', protect, getDashboardSummary);
router.get('/monthly-sales', protect, getMonthlySales);
router.get('/category-distribution', protect, getCategoryDistribution);
router.get('/recent-sales', protect, getRecentSales);
router.get('/top-products', protect, getTopProducts);

module.exports = router;

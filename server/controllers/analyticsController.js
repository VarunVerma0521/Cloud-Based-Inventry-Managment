const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const Supplier = require('../models/supplierModel');
const Sale = require('../models/saleModel');

// @desc    Get dashboard summary
// @route   GET /api/analytics/summary
// @access  Private
const getDashboardSummary = async (req, res) => {
  try {
    // Count totals
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalSuppliers = await Supplier.countDocuments();
    const totalSales = await Sale.countDocuments();

    // Calculate total stock value
    const products = await Product.find({});
    const totalStockValue = products.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );

    // Calculate total revenue
    const sales = await Sale.find({});
    const totalRevenue = sales.reduce((acc, sale) => acc + sale.totalPrice, 0);

    // Get low stock products (quantity < 10)
    const lowStockProducts = await Product.find({ quantity: { $lt: 10 } })
      .populate('category', 'name')
      .populate('supplier', 'name')
      .limit(5);

    res.json({
      totalProducts,
      totalCategories,
      totalSuppliers,
      totalSales,
      totalStockValue: totalStockValue.toFixed(2),
      totalRevenue: totalRevenue.toFixed(2),
      lowStockProducts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get monthly sales data
// @route   GET /api/analytics/monthly-sales
// @access  Private
const getMonthlySales = async (req, res) => {
  try {
    const monthlySales = await Sale.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          totalSales: { $sum: '$totalPrice' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': -1, '_id.month': -1 },
      },
      {
        $limit: 12,
      },
    ]);

    const formattedData = monthlySales.map((item) => ({
      month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
      totalSales: parseFloat(item.totalSales.toFixed(2)),
      count: item.count,
    }));

    res.json(formattedData.reverse());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get stock distribution by category
// @route   GET /api/analytics/category-distribution
// @access  Private
const getCategoryDistribution = async (req, res) => {
  try {
    const categories = await Category.find({});
    
    const distribution = await Promise.all(
      categories.map(async (category) => {
        const products = await Product.find({ category: category._id });
        const totalStock = products.reduce(
          (acc, product) => acc + product.quantity,
          0
        );
        const totalValue = products.reduce(
          (acc, product) => acc + product.price * product.quantity,
          0
        );

        return {
          categoryName: category.name,
          productCount: products.length,
          totalStock,
          totalValue: parseFloat(totalValue.toFixed(2)),
        };
      })
    );

    res.json(distribution);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recent sales
// @route   GET /api/analytics/recent-sales
// @access  Private
const getRecentSales = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;

    const recentSales = await Sale.find({})
      .populate('product', 'name sku')
      .populate('soldBy', 'name')
      .sort('-createdAt')
      .limit(limit);

    res.json(recentSales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get top selling products
// @route   GET /api/analytics/top-products
// @access  Private
const getTopProducts = async (req, res) => {
  try {
    const topProducts = await Sale.aggregate([
      {
        $group: {
          _id: '$product',
          totalQuantitySold: { $sum: '$quantitySold' },
          totalRevenue: { $sum: '$totalPrice' },
          salesCount: { $sum: 1 },
        },
      },
      {
        $sort: { totalQuantitySold: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    const populatedProducts = await Product.populate(topProducts, {
      path: '_id',
      select: 'name sku price',
    });

    const formattedData = populatedProducts.map((item) => ({
      product: item._id,
      totalQuantitySold: item.totalQuantitySold,
      totalRevenue: parseFloat(item.totalRevenue.toFixed(2)),
      salesCount: item.salesCount,
    }));

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardSummary,
  getMonthlySales,
  getCategoryDistribution,
  getRecentSales,
  getTopProducts,
};

const Sale = require('../models/saleModel');
const Product = require('../models/productModel');

// @desc    Get all sales
// @route   GET /api/sales
// @access  Private
const getSales = async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
      ? {
          productName: { $regex: req.query.keyword, $options: 'i' },
        }
      : {};

    const count = await Sale.countDocuments({ ...keyword });
    const sales = await Sale.find({ ...keyword })
      .populate('product', 'name sku')
      .populate('soldBy', 'name email')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort('-createdAt');

    res.json({
      sales,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single sale
// @route   GET /api/sales/:id
// @access  Private
const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate('product', 'name sku price')
      .populate('soldBy', 'name email');

    if (sale) {
      res.json(sale);
    } else {
      res.status(404).json({ message: 'Sale not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create sale
// @route   POST /api/sales
// @access  Private (Admin/Staff)
const createSale = async (req, res) => {
  try {
    const { product, quantitySold } = req.body;

    if (!product || !quantitySold) {
      return res
        .status(400)
        .json({ message: 'Please add product and quantity' });
    }

    // Find product
    const productData = await Product.findById(product);

    if (!productData) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if enough stock
    if (productData.quantity < quantitySold) {
      return res.status(400).json({
        message: `Not enough stock. Available: ${productData.quantity}`,
      });
    }

    // Calculate total price
    const pricePerUnit = productData.price;
    const totalPrice = pricePerUnit * quantitySold;

    // Create sale
    const sale = await Sale.create({
      product: productData._id,
      productName: productData.name,
      quantitySold,
      pricePerUnit,
      totalPrice,
      soldBy: req.user._id,
    });

    // Update product quantity
    productData.quantity -= quantitySold;
    await productData.save();

    const populatedSale = await Sale.findById(sale._id)
      .populate('product', 'name sku')
      .populate('soldBy', 'name email');

    res.status(201).json(populatedSale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete sale
// @route   DELETE /api/sales/:id
// @access  Private (Admin only)
const deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);

    if (sale) {
      // Restore product quantity
      const product = await Product.findById(sale.product);
      if (product) {
        product.quantity += sale.quantitySold;
        await product.save();
      }

      await sale.deleteOne();
      res.json({ message: 'Sale removed and stock restored' });
    } else {
      res.status(404).json({ message: 'Sale not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get sales by date range
// @route   GET /api/sales/filter/daterange
// @access  Private
const getSalesByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const query = {};
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const sales = await Sale.find(query)
      .populate('product', 'name sku')
      .populate('soldBy', 'name email')
      .sort('-createdAt');

    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSales,
  getSaleById,
  createSale,
  deleteSale,
  getSalesByDateRange,
};

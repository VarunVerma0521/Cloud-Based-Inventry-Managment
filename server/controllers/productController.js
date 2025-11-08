const Product = require('../models/productModel');

// @desc    Get all products
// @route   GET /api/products
// @access  Private
const getProducts = async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? {
          $or: [
            { name: { $regex: req.query.keyword, $options: 'i' } },
            { sku: { $regex: req.query.keyword, $options: 'i' } },
          ],
        }
      : {};

    const products = await Product.find({ ...keyword })
      .populate('category', 'name')
      .populate('supplier', 'name contact')
      .populate('createdBy', 'name email')
      .sort('-createdAt');

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Private
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name description')
      .populate('supplier', 'name contact address')
      .populate('createdBy', 'name email');

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private (Admin/Staff)
const createProduct = async (req, res) => {
  try {
    const { name, sku, price, quantity, category, supplier, description } =
      req.body;

    if (!name || !sku || !price || !category || !supplier) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }

    const product = await Product.create({
      name,
      sku,
      price,
      quantity: quantity || 0,
      category,
      supplier,
      description,
      createdBy: req.user._id,
    });

    const populatedProduct = await Product.findById(product._id)
      .populate('category', 'name')
      .populate('supplier', 'name contact');

    res.status(201).json(populatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin/Staff)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = req.body.name || product.name;
      product.sku = req.body.sku || product.sku;
      product.price = req.body.price || product.price;
      product.quantity = req.body.quantity ?? product.quantity;
      product.category = req.body.category || product.category;
      product.supplier = req.body.supplier || product.supplier;
      product.description = req.body.description || product.description;

      const updatedProduct = await product.save();
      
      const populatedProduct = await Product.findById(updatedProduct._id)
        .populate('category', 'name')
        .populate('supplier', 'name contact');

      res.json(populatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin/Staff)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

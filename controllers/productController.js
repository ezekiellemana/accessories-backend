const mongoose = require('mongoose');
const Product = require('../models/Product');

exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, stock, image } = req.body;

    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    const product = await Product.create({ name, description, price, category, stock, image });
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

exports.getAllProducts = async (req, res, next) => {
  try {
    let queryObj = {};
    const { search, category, minPrice, maxPrice, inStock, sort, page = 1, limit = 10 } = req.query;

    if (search) {
      queryObj.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      queryObj.category = category;
    }

    if (minPrice || maxPrice) {
      queryObj.price = {};
      if (minPrice) queryObj.price.$gte = Number(minPrice);
      if (maxPrice) queryObj.price.$lte = Number(maxPrice);
    }

    if (inStock) {
      queryObj.stock = { $gt: 0 };
    }

    let mongoQuery = Product.find(queryObj);

    if (sort) {
      const [field, order] = sort.split('_');
      const sortOrder = order === 'asc' ? 1 : -1;
      mongoQuery = mongoQuery.sort({ [field]: sortOrder });
    } else {
      mongoQuery = mongoQuery.sort({ createdAt: -1 });
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    mongoQuery = mongoQuery.skip(skip).limit(limitNum);

    const products = await mongoQuery;
    const total = await Product.countDocuments(queryObj);
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        totalPages,
        currentPage: pageNum,
        pageSize: limitNum,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    // Prevent updating _id
    if (req.body._id) delete req.body._id;

    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updated) return res.status(404).json({ message: 'Product not found' });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) return res.status(404).json({ message: 'Product not found' });

    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
};

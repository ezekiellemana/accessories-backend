const Product = require('../models/Product');

// @desc Create a new product (Admin only)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, image } = req.body;
    const product = await Product.create({ name, description, price, category, stock, image });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Get all products (Public) with search, filters, sorting & pagination
exports.getAllProducts = async (req, res) => {
  try {
    let queryObj = {};
    const { search, category, minPrice, maxPrice, inStock, sort, page = 1, limit = 10 } = req.query;

    // Search by name or description (case-insensitive)
    if (search) {
      queryObj.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by category
    if (category) {
      queryObj.category = category;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      queryObj.price = {};
      if (minPrice) queryObj.price.$gte = Number(minPrice);
      if (maxPrice) queryObj.price.$lte = Number(maxPrice);
    }

    // Filter by stock availability (inStock=true means stock > 0)
    if (inStock) {
      queryObj.stock = { $gt: 0 };
    }

    // Build the query
    let mongoQuery = Product.find(queryObj);

    // Sorting options
    if (sort) {
      // Examples: sort=price_asc, sort=price_desc, sort=name_asc, sort=name_desc
      const [field, order] = sort.split('_');
      const sortOrder = order === 'asc' ? 1 : -1;
      mongoQuery = mongoQuery.sort({ [field]: sortOrder });
    } else {
      mongoQuery = mongoQuery.sort({ createdAt: -1 }); // default: newest first
    }

    // Pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    mongoQuery = mongoQuery.skip(skip).limit(limitNum);

    // Execute query
    const products = await mongoQuery;

    // Get total count for pagination info
    const total = await Product.countDocuments(queryObj);
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      products,
      pagination: {
        total,
        totalPages,
        currentPage: pageNum,
        pageSize: limitNum,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};



// @desc Update product (Admin only)
exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Delete product (Admin only)
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

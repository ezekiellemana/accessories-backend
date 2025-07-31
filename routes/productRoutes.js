const express = require("express");
const router = express.Router();

const {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Public route
router.get("/", getAllProducts);

// Admin-only routes
router.post("/", protect, adminOnly, createProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

module.exports = router;

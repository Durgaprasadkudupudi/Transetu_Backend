const express = require('express');
const router = express.Router();
const { getProducts, addProduct } = require('../controllers/productController');

// GET /api/products - Get all products with search, sort, and filter
// Query params:
// - search: Text search in name and description
// - category: Filter by category
// - inStock: Filter by stock status (true/false)
// - sort: Field to sort by (e.g., price, name)
// - order: Sort order (asc/desc)
// - page: Page number for pagination
// - limit: Items per page
router.get('/', getProducts);

// POST /api/products - Add a new product
router.post('/', addProduct);

module.exports = router;
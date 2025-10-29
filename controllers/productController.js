const Product = require('../models/productModel');

// Helper to build query based on search params
const buildQuery = (search, category, inStock) => {
    const query = {};

    // Text search on name and description
    if (search) {
        query.$text = { $search: search };
    }

    // Category filter
    if (category) {
        query.category = category;
    }

    // Stock filter
    if (inStock !== undefined) {
        query.inStock = inStock === 'true';
    }

    return query;
};

// Helper to build sort object
const buildSort = (sort, order) => {
    if (!sort) return { createdAt: -1 }; // Default sort by newest

    const sortObj = {};
    sortObj[sort] = order === 'asc' ? 1 : -1;
    return sortObj;
};

exports.getProducts = async (req, res) => {
    try {
        const { 
            search,    // Text search in name/description
            category,  // Filter by category
            inStock,   // Filter by stock status
            sort,      // Field to sort by
            order = 'desc', // Sort order (asc/desc)
            page = 1,  // Page number
            limit = 10 // Items per page
        } = req.query;

        // Build query
        const query = buildQuery(search, category, inStock);
        const sortObj = buildSort(sort, order);

        // Execute query with pagination
        const skip = (page - 1) * limit;
        const products = await Product.find(query)
            .sort(sortObj)
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const total = await Product.countDocuments(query);

        return res.status(200).json({
            message: "Products retrieved successfully",
            data: {
                products,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (err) {
        console.error('Error in getProducts:', err);
        return res.status(500).json({
            message: "Error retrieving products",
            error: err.message
        });
    }
};

// Add a new product
exports.addProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        return res.status(201).json({
            message: "Product added successfully",
            data: product
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error adding product",
            error: err.message
        });
    }
};
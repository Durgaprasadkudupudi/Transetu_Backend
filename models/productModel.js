const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true // Enable text search on name
    },
    description: {
        type: String,
        required: true,
        index: true // Enable text search on description
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        index: true // Enable searching by category
    },
    inStock: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create text index for search
productSchema.index({ name: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
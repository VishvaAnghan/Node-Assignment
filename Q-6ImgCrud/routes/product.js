const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Category = require('../models/category');
const multer = require('multer');
const path = require('path');

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/products/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// List all products
router.get('/', async (req, res) => {
    const products = await Product.find({}).populate('category');
    res.render('products/index', { products });
});

// Create new product form
router.get('/create', async (req, res) => {
    const categories = await Category.find({});
    res.render('products/create', { categories });
});

// Create new product
router.post('/', upload.array('images', 5), async (req, res) => {
    const product = new Product(req.body);
    product.images = req.files.map(file => file.filename);
    await product.save();
    res.redirect('/products');
});

// Edit product form
router.get('/:id/edit', async (req, res) => {
    const product = await Product.findById(req.params.id);
    const categories = await Category.find({});
    res.render('products/edit', { product, categories });
});

// Update product
router.post('/:id', upload.array('images', 5), async (req, res) => {
    const product = await Product.findById(req.params.id);
    product.name = req.body.name;
    product.description = req.body.description;
    product.category = req.body.category;
    product.price = req.body.price;
    
    if (req.files.length > 0) {
        product.images = req.files.map(file => file.filename);
    }
    
    await product.save();
    res.redirect('/products');
});

// Delete product
router.post('/:id/delete', async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/products');
});

module.exports = router;

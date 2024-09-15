const express = require('express');
const router = express.Router();
const Category = require('../models/category');

// List all categories
router.get('/', async (req, res) => {
    const categories = await Category.find({});
    res.render('categories/index', { categories });
});

// Create new category form
router.get('/create', (req, res) => {
    res.render('categories/create');
});

// Create new category
router.post('/', async (req, res) => {
    const category = new Category(req.body);
    await category.save();
    res.redirect('/categories');
});

// Edit category form
router.get('/:id/edit', async (req, res) => {
    const category = await Category.findById(req.params.id);
    res.render('categories/edit', { category });
});

// Update category
router.post('/:id', async (req, res) => {
    await Category.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/categories');
});

// Delete category
router.post('/:id/delete', async (req, res) => {
    await Category.findByIdAndDelete(req.params.id);
    res.redirect('/categories');
});

module.exports = router;

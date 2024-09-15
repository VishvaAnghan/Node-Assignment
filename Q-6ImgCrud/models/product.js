const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    price: Number,
    images: [String],  // Array of strings to hold image file names
});

module.exports = mongoose.model('Product', productSchema);

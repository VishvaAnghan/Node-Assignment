const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');

const app = express();

// Database connection
mongoose.connect('mongodb://localhost:27017/Assi-2'); 
// {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set EJS as view engine
app.set('view engine', 'ejs');

// Routes
app.use('/categories', categoryRoutes);
app.use('/products', productRoutes);

// Start server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

// npm init -y
// npm install express mongoose multer ejs

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const userRoutes = require('./routes/user');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Assi-2'); 
// {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));  // Serve static files (images, files)
app.set('view engine', 'ejs');

// Routes
app.use('/users', userRoutes);

// Start server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

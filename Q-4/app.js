require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); 
const app = express();

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected')).catch(err => console.log(err));
// , {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })

// Middleware
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const studentRoutes = require('./routes/studentRoutes');
app.use('/', studentRoutes);

// Start the server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});

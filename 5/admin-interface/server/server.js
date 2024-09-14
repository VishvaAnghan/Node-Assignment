const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { mongoURI } = require('./config');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

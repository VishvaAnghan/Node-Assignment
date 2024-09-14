const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');

const app = express();
const port = 4000;

// Set up static file serving
app.use(express.static('public'));

// Set up EJS view engine
app.set('view engine', 'ejs');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images and PDFs only!');
    }
  }
});

// Route to render the registration form
app.get('/', (req, res) => {
  res.render('index');
});

// Handle file uploads
app.post('/upload', upload.array('files', 5), (req, res) => {
  res.redirect('/list');
});

// Route to list uploaded files
app.get('/list', (req, res) => {
  fs.readdir('public/uploads', (err, files) => {
    if (err) throw err;
    res.render('list', { files });
  });
});

// Route to download files
app.get('/download/:filename', (req, res) => {
  const file = path.join(__dirname, 'public/uploads', req.params.filename);
  res.download(file);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

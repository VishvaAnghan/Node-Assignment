const express = require('express')
const router = express.Router()
const multer= require('multer')
const path= require('path')
const User = require('../models/user')
const{body, validationResult} = require('express-validator')

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null, './uploads/files')
    },
    filename:(req, file, cb)=>{
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({storage})

// User Registration Form (GET)
router.get('/register', (req, res) => {
    res.render('users/register');
});

// Register User (POST)
router.post('/register', 
    upload.array('files', 5),  // Accept up to 5 files
    [
        // Validation checks
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Enter a valid email'),
        body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            return res.render('users/register', { errors: errors.array() });
        }
        
        // Handle file uploads and store user data
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            files: req.files.map(file => file.filename)
        });
        
        await user.save();
        res.redirect('/users/files');
    }
);

// List all uploaded files for a user
router.get('/files', async (req, res) => {
    const users = await User.find({});
    res.render('users/files', { users });
});

// Route for file download
router.get('/download/:filename', (req, res) => {
    const filePath = path.join(__dirname, '../uploads/files/', req.params.filename);
    res.download(filePath, (err) => {
        if (err) {
            console.log(err);
            res.send('Error downloading the file.');
        }
    });
});

module.exports = router;



// npm init -y
// npm install express mongoose multer ejs express-validator

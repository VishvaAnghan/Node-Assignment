const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const Student = require('../models/Student');

// JWT Middleware for Authentication
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token; // Get the token from cookies

    if (!token) {
        return res.redirect('/login');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.redirect('/login');
        }
        req.user = user;
        next();
    });
};


// Home Route
router.get('/', authenticateToken, async (req, res) => {
    try {
        const students = await Student.find();
        res.render('index', { students });
    } catch (error) {
        res.status(500).send('Error fetching students.');
    }
});

// Register Route
router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send('Username already taken. Please choose another one.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.redirect('/login');
    } catch (err) {
        res.status(500).send('Error during registration. Please try again later.');
    }
    // const hashedPassword = await bcrypt.hash(password, 10);

    // const newUser = new User({ username, password: hashedPassword });
    // await newUser.save();

    // res.redirect('/login');
});

// Login Route
router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Find user by username
        const user = await User.findOne({ username });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

            // Set token in a cookie
            res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour expiry

            // Redirect to students index
            return res.redirect('/');
        } else {
            res.status(400).send('Invalid username or password');
        }
    } catch (error) {
        res.status(500).send('Server error. Please try again later.');
    }
});

// CRUD Operations for Students
// Create Student
router.get('/students/new', authenticateToken, (req, res) => {
    res.render('new');
});

router.post('/students', authenticateToken, async (req, res) => {
    const { name, age, course } = req.body;
    const newStudent = new Student({ name, age, course });
    await newStudent.save();
    res.redirect('/');
});

// Edit Student
router.get('/students/edit/:id', authenticateToken, async (req, res) => {
    const student = await Student.findById(req.params.id);
    res.render('edit', { student });
});

router.post('/students/edit/:id', authenticateToken, async (req, res) => {
    const { name, age, course } = req.body;
    await Student.findByIdAndUpdate(req.params.id, { name, age, course });
    res.redirect('/');
});

// Delete Student
router.post('/students/delete/:id', authenticateToken, async (req, res) => {
    await Student.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

module.exports = router;

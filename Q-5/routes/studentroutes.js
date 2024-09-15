const express = require('express');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const router = express.Router();


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401); // If no token, return 401 Unauthorized

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // If token invalid, return 403 Forbidden
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;

// Middleware to authenticate JWT
// function authenticateToken(req, res, next) {
//     const token = req.cookies.token;
//     if (!token) return res.status(401).send('Access Denied');
    
//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//         if (err) return res.status(403).send('Forbidden');
//         req.user = user;
//         next();
//     });
// }

// CRUD Operations
// Create Student
router.post('/', authenticateToken, async (req, res) => {
    const { name, age, course } = req.body;
    try {
        const newStudent = new Student({ name, rollno, age, course });
        await newStudent.save();
        res.status(201).send('Student created');
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Read Students
router.get('/', authenticateToken, async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Update Student
router.put('/:id', authenticateToken, async (req, res) => {
    const { name, age, course } = req.body;
    try {
        await Student.findByIdAndUpdate(req.params.id, { name, age, course });
        res.send('Student updated');
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Delete Student
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.send('Student deleted');
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
module.exports = authenticateToken;

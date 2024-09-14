const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Student = require('../models/Student');
const { secret } = require('../config');

// Middleware to check token
function authenticateToken(req, res, next) {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, secret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Get all students
router.get('/', authenticateToken, async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a student
router.post('/', authenticateToken, async (req, res) => {
  const { name, age, grade } = req.body;
  const newStudent = new Student({ name, age, grade });

  try {
    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent);
  } catch (error) {
    res.status(400).json({ message: 'Bad request' });
  }
});

// Update a student
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, age, grade } = req.body;

  try {
    const updatedStudent = await Student.findByIdAndUpdate(id, { name, age, grade }, { new: true });
    if (!updatedStudent) return res.status(404).json({ message: 'Student not found' });
    res.json(updatedStudent);
  } catch (error) {
    res.status(400).json({ message: 'Bad request' });
  }
});

// Delete a student
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedStudent = await Student.findByIdAndDelete(id);
    if (!deletedStudent) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Bad request' });
  }
});

module.exports = router;

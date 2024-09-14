const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const bcrypt = require('bcryptjs');
const User = require('./models/user');
const Student = require('./models/student');
const path = require('path');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/student')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Setup view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Setup body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// Setup session and flash messages
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
}));
app.use(flash());

// Middleware for setting flash messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Middleware for authentication
const ensureAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  req.flash('error_msg', 'Please log in to view this resource');
  res.redirect('/login');
};

// Routes
app.get('/', ensureAuthenticated, (req, res) => {
  res.render('index');
});

// Registration route
app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    req.flash('success_msg', 'You are now registered and can log in');
    res.redirect('/login');
  } catch (err) {
    req.flash('error_msg', 'Something went wrong');
    res.redirect('/register');
  }
});

// Login route
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.userId = user._id;
    req.flash('success_msg', 'You are now logged in');
    res.redirect('/');
  } else {
    req.flash('error_msg', 'Invalid username or password');
    res.redirect('/login');
  }
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    req.flash('success_msg', 'You are now logged out');
    res.redirect('/login');
  });
});

// CRUD routes for students
app.get('/students', ensureAuthenticated, async (req, res) => {
  const students = await Student.find();
  res.render('students/list', { students });
});

app.get('/students/add', ensureAuthenticated, (req, res) => {
  res.render('students/edit', { student: {} });
});

app.post('/students/add', ensureAuthenticated, async (req, res) => {
  try {
    const { name, age, grade } = req.body;
    const student = new Student({ name, age, grade });
    await student.save();
    req.flash('success_msg', 'Student added successfully');
    res.redirect('/students');
  } catch (err) {
    req.flash('error_msg', 'Error adding student');
    res.redirect('/students/add');
  }
});

app.get('/students/edit/:id', ensureAuthenticated, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    res.render('students/edit', { student });
  } catch (err) {
    req.flash('error_msg', 'Student not found');
    res.redirect('/students');
  }
});

app.post('/students/edit/:id', ensureAuthenticated, async (req, res) => {
  try {
    const { name, age, grade } = req.body;
    await Student.findByIdAndUpdate(req.params.id, { name, age, grade });
    req.flash('success_msg', 'Student updated successfully');
    res.redirect('/students');
  } catch (err) {
    req.flash('error_msg', 'Error updating student');
    res.redirect(`/students/edit/${req.params.id}`);
  }
});

app.get('/students/delete/:id', ensureAuthenticated, async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Student deleted successfully');
    res.redirect('/students');
  } catch (err) {
    req.flash('error_msg', 'Error deleting student');
    res.redirect('/students');
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

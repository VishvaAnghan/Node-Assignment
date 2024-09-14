const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: false }));

// Session configuration
app.use(session({
  store: new FileStore({}),
  secret: 'your-secret-key', // Replace with a strong secret
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Simple login page
app.get('/', (req, res) => {
  if (req.session.loggedIn) {
    res.send(`<h1>Welcome ${req.session.username}!</h1><a href="/logout">Logout</a>`);
  } else {
    res.send(`
      <h1>Login</h1>
      <form action="/login" method="POST">
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" required>
        <button type="submit">Login</button>
      </form>
    `);
  }
});

// Handle login
app.post('/login', (req, res) => {
  const { username } = req.body;
  if (username) {
    req.session.loggedIn = true;
    req.session.username = username;
    res.redirect('/');
  } else {
    res.status(400).send('Username is required');
  }
});

// Handle logout
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Could not log out');
    }
    res.redirect('/');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
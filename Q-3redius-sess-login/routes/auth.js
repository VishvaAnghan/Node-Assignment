const express = require('express');
const router = express.Router();

// Dummy user credentials
const USERNAME = 'admin';
const PASSWORD = 'password';

// Login route
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === USERNAME && password === PASSWORD) {
        req.session.isAuthenticated = true;
        req.session.username = username;
        res.redirect('/');
    } else {
        res.send('Invalid username or password! <a href="/login.html">Try again</a>');
    }
});

// Logout route
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.send('Error logging out!');
        }
        res.redirect('/login.html');
    });
});

module.exports = router;

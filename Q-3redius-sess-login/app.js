const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis').default//(session);
const redis = require('redis');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');

// Create Redis client
const redisClient = redis.createClient({
    host: '127.0.0.1',
    port: 6379
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Session setup with Redis store
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: 'my_super_secret_key', // Replace with a secure secret in production
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 } // 1 hour session
}));

// Serve static HTML files
app.use(express.static('views'));

// Use authentication routes
app.use('/auth', authRoutes);

// Homepage route
app.get('/', (req, res) => {
    if (req.session.isAuthenticated) {
        res.send(`<h1>Welcome ${req.session.username}!</h1><a href="/auth/logout">Logout</a>`);
    } else {
        res.redirect('/login.html');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

//npm init
//npm install express express-session connect-redis redis body-parser
//redis-server

require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET, // Use secret from .env file
    resave: false,
    saveUninitialized: true,
}));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { // Use URI from .env file
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.log('Failed to connect to MongoDB:', err));

// Schema and Model
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = mongoose.model('user', userSchema); // Collection name is 'user'

// Serve login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Handle login submission
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find user in the database
        const user = await User.findOne({ email, password });
        if (user) {
            // Set session and redirect to page1.html on success
            req.session.userId = user._id;
            res.redirect('/page1.html'); // Redirect to page1.html after successful login
        } else {
            res.send('Invalid credentials. Please try again.');
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('An error occurred. Please try again.');
    }
});

// Serve page1.html only if user is logged in
app.get('/page1.html', (req, res) => {
    if (req.session.userId) {
        res.sendFile(path.join(__dirname, 'public', 'page1.html'));
    } else {
        res.redirect('/login'); // Redirect to login if not authenticated
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

// Models
const Student = require('./models/Student');
const Trainer = require('./models/Trainer');

const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET, // Use secret from .env file
    resave: false,
    saveUninitialized: true,
}));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.log('Failed to connect to MongoDB:', err));

// User Schema and Model for Login
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});
const User = mongoose.model('user', userSchema);

// Root route to redirect to login
app.get('/', (req, res) => {
    res.redirect('/login');
});

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
            res.redirect('/page1.html');
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
        res.redirect('/login');
    }
});

// Student Routes
app.post('/api/students', async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).send(student);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

app.get('/api/students', async (req, res) => {
    const search = req.query.search || '';
    try {
        const students = await Student.find({ name: new RegExp(search, 'i') });
        res.send(students);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.put('/api/students/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const student = await Student.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!student) {
            return res.status(404).send({ error: 'Student not found' });
        }
        res.send(student);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Trainer Routes
app.post('/api/trainers', async (req, res) => {
    try {
        const trainer = new Trainer(req.body);
        await trainer.save();
        res.status(201).send(trainer);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

app.get('/api/trainers', async (req, res) => {
    const search = req.query.search || '';
    try {
        const trainers = await Trainer.find({ name: new RegExp(search, 'i') });
        res.send(trainers);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.put('/api/trainers/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const trainer = await Trainer.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!trainer) {
            return res.status(404).send({ error: 'Trainer not found' });
        }
        res.send(trainer);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

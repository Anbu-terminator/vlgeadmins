require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Student = require('./models/Student');
const Trainer = require('./models/Trainer');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(console.error);

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

// Root Route - Serve Main Page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'page1.html')); // Replace with the desired main page
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

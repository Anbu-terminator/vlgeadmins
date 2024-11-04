// models/Trainer.js
const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    qualification: { type: String, required: true },
    dob: { type: Date, required: true },
    doj: { type: Date, required: true },
    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    address: { type: String, required: true },
    aadhar: { type: String, required: true, unique: true },
    pan: { type: String, required: true, unique: true },
    trainingCourse: { type: String, required: true }
});

const Trainer = mongoose.model('Trainer', trainerSchema);
module.exports = Trainer;

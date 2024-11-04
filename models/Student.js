// models/Student.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    aadhar: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    pin: { type: String, required: true },
    course: { type: String, required: true },
    offer: { type: String },
    duration: { type: String, required: true }
});

module.exports = mongoose.model('Student', studentSchema);

const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
    studentId: { type: String, unique: true },
    fullName: String,
    balance: { type: Number, default: 0 }
});

module.exports = mongoose.model("Student", StudentSchema);

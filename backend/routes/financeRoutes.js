const express = require("express");
const Student = require("../models/Student");
const Transaction = require("../models/Transaction");
const auth = require("../middleware/auth");

const router = express.Router();


// ===========================================
// REGISTER STUDENT
// ===========================================
router.post("/register", auth(["finance"]), async (req, res) => {

    try {

        const { studentId, fullName, initialAmount } = req.body;

        if (!studentId || !fullName) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        // Check duplicate
        const existing = await Student.findOne({ studentId });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Student already exists"
            });
        }

        const student = new Student({
            studentId: studentId.trim(),
            fullName: fullName.trim(),
            balance: Number(initialAmount) || 0
        });

        await student.save();

        await Transaction.create({
            studentId,
            type: "credit",
            amount: Number(initialAmount) || 0
        });

        return res.json({ success: true });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }

});


// ===========================================
// CREDIT WALLET
// ===========================================
router.post("/credit", auth(["finance"]), async (req, res) => {

    try {

        const { studentId, amount } = req.body;

        const student = await Student.findOne({ studentId });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        student.balance += Number(amount);
        await student.save();

        await Transaction.create({
            studentId,
            type: "credit",
            amount: Number(amount)
        });

        return res.json({ success: true });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }

});


// ===========================================
// GET ALL STUDENTS  (🔥 THIS WAS MISSING)
// ===========================================
router.get("/all", auth(["finance"]), async (req, res) => {

    try {

        const students = await Student.find().sort({ createdAt: -1 });

        return res.json({
            success: true,
            students
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }

});


module.exports = router;

// ===========================================
// HIT CANTEEN SYSTEM
// STUDENT ROUTES
// ===========================================

const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const Order = require("../models/Order");
const Transaction = require("../models/Transaction");
const QRCode = require("qrcode");

/* =========================
   LOGIN
========================= */
router.post("/login", async (req, res) => {

    const { studentId } = req.body;

    const student = await Student.findOne({ studentId });

    if (!student) {
        return res.json({ success: false, message: "Student Not Found" });
    }

    res.json({ success: true, student });
});


/* =========================
   CHECKOUT
========================= */
router.post("/checkout", async (req, res) => {

    try {

        const { studentId, studentName, meals, totalAmount } = req.body;

        const student = await Student.findOne({ studentId });

        if (!student) {
            return res.json({ success: false, message: "Student Not Found" });
        }

        if (student.balance < totalAmount) {
            return res.json({ success: false, message: "Insufficient Balance" });
        }

        // Deduct balance
        student.balance -= totalAmount;
        await student.save();

        // Generate Order Number
        const orderNumber = "ORD-" + Date.now();

        // Save Order
        await Order.create({
            orderNumber,
            studentId,
            studentName,
            meals,
            totalAmount
        });

        // Log Transaction
        await Transaction.create({
            studentId,
            studentName,
            type: "debit",
            amount: totalAmount,
            balanceAfter: student.balance,
            reference: orderNumber
        });

        // Generate QR Code
        const qrCode = await QRCode.toDataURL(
            JSON.stringify({ orderNumber, studentId })
        );

        res.json({
            success: true,
            orderNumber,
            qrCode,
            newBalance: student.balance
        });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Server Error" });
    }
});


/* =========================
   GET ORDER HISTORY
========================= */
router.get("/orders/:studentId", async (req, res) => {

    try {

        const { studentId } = req.params;

        const orders = await Order.find({ studentId })
            .sort({ timestamp: -1 });

        res.json({ success: true, orders });

    } catch (error) {

        res.json({ success: false, message: "Server Error" });
    }
});


/* =========================
   GET ALL TRANSACTIONS (ADMIN)
========================= */
router.get("/transactions", async (req, res) => {

    try {

        const transactions = await Transaction.find()
            .sort({ timestamp: -1 });

        res.json({ success: true, transactions });

    } catch (error) {

        res.json({ success: false, message: "Server Error" });
    }
});

module.exports = router;

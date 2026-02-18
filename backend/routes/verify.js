// ===========================================
// HIT CANTEEN SYSTEM - SECURE VERIFY ROUTE
// Backend Order Verification Engine
// ===========================================

const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// POST: /api/verify
router.post("/verify", async (req, res) => {

    try {

        const { orderNumber, studentId } = req.body;

        // Basic validation
        if (!orderNumber || !studentId) {
            return res.json({
                success: false,
                message: "Missing Order Number or Student ID"
            });
        }

        // Find order in DB
        const order = await Order.findOne({ orderNumber });

        if (!order) {
            return res.json({
                success: false,
                message: "Order Not Found"
            });
        }

        // Check student match
        if (order.studentId !== studentId) {
            return res.json({
                success: false,
                message: "Student Mismatch"
            });
        }

        // Prevent reuse (THIS is your only termination logic)
        if (order.status === "used") {
            return res.json({
                success: false,
                message: "Order Already Used"
            });
        }

        // Mark as used immediately upon successful scan
        order.status = "used";
        await order.save();

        return res.json({
            success: true,
            order: {
                orderNumber: order.orderNumber,
                studentId: order.studentId,
                studentName: order.studentName,
                meals: order.meals,
                verifiedAt: Date.now()
            }
        });

    } catch (error) {

        console.error("Verification Error:", error.message);

        return res.json({
            success: false,
            message: "Server Error"
        });
    }

});

module.exports = router;

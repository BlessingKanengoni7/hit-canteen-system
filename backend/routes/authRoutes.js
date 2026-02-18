const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


// ============================
// LOGIN ROUTE
// ============================
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ error: "User not found" });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            "HIT_SECRET",
            { expiresIn: "8h" }
        );

        res.json({ success: true, token, role: user.role });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ============================
// TEMP SETUP ROUTE (DELETE AFTER USE)
// ============================
router.get("/setup-admins", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash("123456", 10);

        await User.deleteMany({});

        await User.create([
            {
                username: "finance",
                password: hashedPassword,
                role: "finance"
            },
            {
                username: "canteen",
                password: hashedPassword,
                role: "canteen"
            }
        ]);

        res.json({ message: "Admins created successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;

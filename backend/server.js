// ===========================================
// HIT CANTEEN SYSTEM - PRODUCTION SERVER
// Backend + Frontend Served Together
// SECURE + DEPLOYMENT READY VERSION
// ===========================================

// 🔐 LOAD ENV VARIABLES FIRST (VERY IMPORTANT)
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

// ROUTES
const authRoutes = require("./routes/authRoutes");
const financeRoutes = require("./routes/financeRoutes");
const canteenRoutes = require("./routes/canteenRoutes");
const studentRoutes = require("./routes/studentRoutes");
const verifyRoutes = require("./routes/verify"); // Secure verification route

// ===============================
// CONNECT DATABASE
// ===============================
connectDB();

const app = express();

// ===============================
// MIDDLEWARE
// ===============================
app.use(cors());
app.use(express.json());

// ===============================
// API ROUTES
// ===============================
app.use("/api/auth", authRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/canteen", canteenRoutes);
app.use("/api/student", studentRoutes);
app.use("/api", verifyRoutes); // Handles /api/verify

// ===============================
// SERVE FRONTEND
// ===============================

// Serve static frontend folder
app.use(express.static(path.join(__dirname, "../frontend")));

// Default route → Admin login
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/admin-login.html"));
});

// Catch-all fallback (prevents routing errors in production)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/admin-login.html"));
});

// ===============================
// START SERVER
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`🚀 Production Server Running at http://localhost:${PORT}`)
);

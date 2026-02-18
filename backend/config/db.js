// ===========================================
// HIT CANTEEN SYSTEM
// DATABASE CONNECTION (MONGOOSE v7 SAFE)
// ===========================================

const mongoose = require("mongoose");

const connectDB = async () => {
    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ MongoDB Connected");

    } catch (err) {

        console.error("❌ Database Connection Failed:", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;

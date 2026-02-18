// ===========================================
// HIT CANTEEN SYSTEM
// ORDER MODEL (Backend Source of Truth)
// ===========================================

const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
}, { _id: false });

const orderSchema = new mongoose.Schema({

    orderNumber: {
        type: String,
        required: true,
        unique: true,
        index: true
    },

    studentId: {
        type: String,
        required: true,
        index: true
    },

    studentName: {
        type: String,
        required: true
    },

    meals: {
        type: [mealSchema],
        required: true
    },

    totalAmount: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: ["pending", "used"],
        default: "pending"
    },

    timestamp: {
        type: Number,
        default: Date.now
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Order", orderSchema);

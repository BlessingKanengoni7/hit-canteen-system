// ===========================================
// HIT CANTEEN SYSTEM
// TRANSACTION MODEL (Audit Trail)
// ===========================================

const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({

    studentId: {
        type: String,
        required: true
    },

    studentName: {
        type: String,
        required: true
    },

    type: {
        type: String,
        enum: ["debit", "credit"],
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    balanceAfter: {
        type: Number,
        required: true
    },

    reference: {
        type: String // Order Number
    },

    timestamp: {
        type: Number,
        default: Date.now
    }

});

module.exports = mongoose.model("Transaction", transactionSchema);

const mongoose = require("mongoose");

const MealSchema = new mongoose.Schema({
    name: String,
    price: Number,
    available: { type: Boolean, default: true }
});

module.exports = mongoose.model("Meal", MealSchema);

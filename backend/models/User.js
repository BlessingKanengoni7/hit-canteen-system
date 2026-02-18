const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["finance", "canteen", "student"] }
});

module.exports = mongoose.model("User", UserSchema);

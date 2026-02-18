const express = require("express");
const Meal = require("../models/Meal");
const auth = require("../middleware/auth");

const router = express.Router();


// ===========================================
// ADD MEAL
// ===========================================
router.post("/add", auth(["canteen"]), async (req, res) => {

    try {

        const { name, price } = req.body;

        if (!name || !price) {
            return res.status(400).json({
                success: false,
                message: "Missing meal data"
            });
        }

        await Meal.create({
            name: name.trim(),
            price: Number(price),
            available: true
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
// TOGGLE AVAILABILITY
// ===========================================
router.post("/toggle", auth(["canteen"]), async (req, res) => {

    try {

        const meal = await Meal.findById(req.body.mealId);

        if (!meal) {
            return res.status(404).json({
                success: false,
                message: "Meal not found"
            });
        }

        meal.available = !meal.available;
        await meal.save();

        return res.json({ success: true });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }

});


// ===========================================
// GET ALL MEALS (ADMIN)
// ===========================================
router.get("/all", async (req, res) => {

    try {

        const meals = await Meal.find().sort({ createdAt: -1 });

        return res.json({
            success: true,
            meals
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }

});


// ===========================================
// GET AVAILABLE MEALS (STUDENTS)
// ===========================================
router.get("/available", async (req, res) => {

    try {

        const meals = await Meal.find({ available: true });

        return res.json({
            success: true,
            meals
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }

});


module.exports = router;

const express = require("express");
const router = express.Router();
const Restaurant = require("../models/Restruant");

router.post("/addRestraunt", async (req, res) => {
    try {
        const restaurant = new Restaurant({
            RestaurantName: req.body.name,
            category: req.body.category,
            rating: req.body.rating,
            image: req.body.image,
            bio: req.body.bio,
            location: req.body.location,
            Hours: req.body.hours,
            price_Range: req.body.price_range,
            menu: req.body.menu || []
        });

        await restaurant.save();

        res.json({ message: "Restaurant added successfully", restaurant });
    } catch (error) {
        console.error('Error saving restaurant:', error);
        res.status(500).json({ error: 'Failed to save restaurant', details: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const restaurants = await Restaurant.find({});
        res.json(restaurants);
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        res.status(500).json({ error: 'Failed to fetch restaurants' });
    }
});

module.exports = router;

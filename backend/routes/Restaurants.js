const express = require("express")
const router = express.Router();
const Restaurant = require("../models/Restaurant");

router.post("/addRestaurant", async (req, res) => {
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

router.put("/addMenuItem/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { item, description, price } = req.body;

        if (!item || !description || !price) {
            return res.status(404).json({
                error: "Missing fields",
                message: "item, description, or price fields are missing"
            })
        }

        const restaurant = await Restaurant.findOne({ restaurantId: id });

        if (!restaurant) {
            return res.status(400).json({
                message: `Restaurant with id: ${id} could not be found`,
            })
        }

        const menuItem = {
            item,
            description,
            price
        }

        restaurant.menu.push(menuItem)

        const updatedRestaurant = await restaurant.save();

        console.log(`Restaurant has been updated: ${updatedRestaurant}`);
        return res.status(200).json({
            message: "Restaurant has been updated",
            restaurant: updatedRestaurant
        })
    } catch (e) {
        console.error(`Error updating restaurant: ${e}`);
        res.status(500).json({
            error: "Failed to update restaurant",
            details: e.message
        })
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
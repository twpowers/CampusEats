const express     = require("express");
const router      = express.Router();
const Restaurant  = require("../models/Restaurant");

router.get("/", async (_req, res) => {
  try {
    const restaurants = await Restaurant.find({});
    res.json(restaurants);
  } catch (err) {
    console.error("Fetch list error:", err);
    res.status(500).json({ error: "Failed to fetch restaurants" });
  }
});

router.post("/addRestaurant", async (req, res) => {
  try {
    const restaurant = new Restaurant({
      RestaurantName: req.body.RestaurantName,
      category:       req.body.category,
      rating:         req.body.rating,
      image:          req.body.image,
      bio:            req.body.bio,
      location:       req.body.location,
      Hours:          req.body.Hours,
      price_range:    req.body.price_range,
      menu:           req.body.menu || [],
    });

    await restaurant.save();
    res.json({ message: "Restaurant added successfully", restaurant });
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).json({ error: "Failed to save restaurant", details: err.message });
  }
});

router.put("/addMenuItem/:id", async (req, res) => {
  try {
    const { item, description, price } = req.body;
    if (!item || !description || !price)
      return res.status(400).json({ error: "Missing item / description / price" });

    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant)
      return res.status(404).json({ error: `Restaurant ${req.params.id} not found` });

    restaurant.menu.push({ item, description, price });
    const updated = await restaurant.save();

    res.json({ message: "Menu updated", restaurant: updated });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Failed to update menu", details: err.message });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ error: "Not found" });
    res.json(restaurant);
  } catch (err) {
    console.error("Fetch‑one error:", err);
    res.status(500).json({ error: "Server Error", details: err.message });
  }
});

module.exports = router;

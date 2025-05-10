const express = require("express").Router
const router = express();
const { connectToDatabase } = require("../db");
const User = require("../models/Users")

router.get("/", async (req, res) => {
    try {
        const user = new User({ name: 'John', email: 'john@example.com', password: "test" });
        const db = await connectToDatabase();
        const collection = db.collection('Users');
        user.save()
        const items = await collection.find({}).toArray();
        res.json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: 'Failed to fetch items' });
    }
})

module.exports = router

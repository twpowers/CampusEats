const express = require("express").Router
const router = express();
const { connectToDatabase } = require("../db");

router.get("/", async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('test');
        const items = await collection.find({}).toArray();
        res.json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: 'Failed to fetch items' });
    }
})

module.exports = router

const express = require("express").Router
const router = express();
const User = require("../models/Users")

router.post("/addPropUser", async (req, res) => {
    try {
        const user = new User({
            name: 'John',
            email: 'john@example.com',
            password: "test"
        });

        await user.save();

        res.json({ message: "added users", user });
        console.log(req);
    } catch (error) {
        console.error('Error saving/fetching users:', error);
        res.status(500).json({ error: 'Failed to save/fetch users' });
    }
})

router.get("/", async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed fetch users' });
    }
})

module.exports = router

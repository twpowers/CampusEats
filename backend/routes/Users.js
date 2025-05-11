const express = require("express");
const router = express.Router();
const User = require("../models/Users");

router.post("/addPropUser", async (req, res) => {
    try {
        const user = new User({
            name: 'John',
            email: 'john@example.com',
            password: "test"
        });

        await user.save();

        res.status(200).json({ message: "added users", user });
    } catch (error) {
        console.error('Error saving/fetching users:', error);
        res.status(500).json({ error: 'Failed to save/fetch users' });
    }
})

router.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        console.log(email)
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ error: 'Invaild email of password' })
        }

        if (user.password != password) {
            return res.status(400).json({ error: "Invaild email or password" })
        }
        res.status(200).json({ user: user })

    } catch (e) {
        console.error("Login error", e);
        return res.status(500).json({ error: "Server Error" })
    }
})

router.get("/", async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed fetch users' });
    }
})

module.exports = router

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/Users");

router.post("/addPropUser", async (req, res) => {
  try {
    const user = new User({
      name: "John",
      email: "john@example.com",
      password: "test1234"
    });
    await user.save();
    res.status(200).json({ message: "added users", user });
  } catch (error) {
    console.error("Error saving/fetching users:", error);
    res.status(500).json({ error: "Failed to save/fetch users" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", email);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    res.status(200).json({
      user: {
        _id:  user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (e) {
    console.error("Login error", e);
    res.status(500).json({ error: "Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed fetch users" });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({
      $or: [{ email }, { name }]
    });
    if (existing) {
      if (existing.email === email) {
        return res.status(400).json({ error: "Email already in use" });
      }
      if (existing.name === name) {
        return res.status(400).json({ error: "Name already taken" });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hash });
    await newUser.save();

    res.status(201).json({
      user: {
        _id:  newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const User = require("../models/user");

// SIGNUP
router.post("/", async (req, res) => {
  try {
    const { email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User(req.body);
    const saved = await user.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET USERS
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("DB password:", user.password);
    console.log("Typed password:", password);
    console.log("Match:", String(user.password).trim() === String(password).trim());

    if (String(user.password).trim() !== String(password).trim()) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE PROFILE
router.put("/update", async (req, res) => {
  try {
    const { email, ...updates } = req.body;

    const user = await User.findOneAndUpdate(
      { email },
      updates,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
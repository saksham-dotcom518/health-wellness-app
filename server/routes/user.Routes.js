const express = require("express");
const router = express.Router();
const User = require("../models/user");


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



router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});



router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
  return res.status(404).json({ message: "User not found" });
}

if (String(user.password).trim() !== String(password).trim()) {
  return res.status(400).json({ message: "Invalid password" });
}
    res.json({ message: "Login successful", user });

  } catch (err) {
    res.status(500).json(err);
  }
});


router.put("/update", async (req, res) => {
  try {
    const { email, ...updates } = req.body;

    const user = await User.findOneAndUpdate(
      { email },
      updates,
      { new: true }
    );

    res.json(user);

  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
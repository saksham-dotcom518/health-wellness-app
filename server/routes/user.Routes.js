const express = require("express");
const router = express.Router();
const User = require("../models/user");

// POST
router.post("/", async (req, res) => {
  try {
    const user = new User(req.body);
    const saved = await user.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
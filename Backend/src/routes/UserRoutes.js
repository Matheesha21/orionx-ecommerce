const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = new User({
      username,
      email,
      password
    });

    await user.save();

    res.status(201).json({
      message: "User created successfully",
      user
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
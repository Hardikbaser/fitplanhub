const express = require("express");
const Follow = require("../models/Follow");
const auth = require("../middleware/auth");

const router = express.Router();

// Follow a trainer
router.post("/:trainerId", auth, async (req, res) => {
  try {
    const follow = new Follow({
      follower: req.user.id,
      following: req.params.trainerId,
    });
    await follow.save();
    res.json({ msg: "Followed" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Unfollow
router.delete("/:trainerId", auth, async (req, res) => {
  try {
    await Follow.findOneAndDelete({
      follower: req.user.id,
      following: req.params.trainerId,
    });
    res.json({ msg: "Unfollowed" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Get followed trainers
router.get("/", auth, async (req, res) => {
  try {
    const follows = await Follow.find({ follower: req.user.id }).populate(
      "following",
      "name"
    );
    res.json(follows);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;

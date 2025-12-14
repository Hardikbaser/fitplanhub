const express = require("express");
const Subscription = require("../models/Subscription");
const auth = require("../middleware/auth");

const router = express.Router();

// Subscribe to plan (simulate payment)
router.post("/:planId", auth, async (req, res) => {
  try {
    const sub = new Subscription({
      user: req.user.id,
      plan: req.params.planId,
    });
    await sub.save();
    res.json({ msg: "Subscribed successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Get user's subscriptions
router.get("/", auth, async (req, res) => {
  try {
    const subs = await Subscription.find({ user: req.user.id }).populate(
      "plan"
    );
    res.json(subs);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;

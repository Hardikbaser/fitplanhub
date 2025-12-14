const express = require("express");
const Plan = require("../models/Plan");
const auth = require("../middleware/auth");

const router = express.Router();

// Get all plans (public preview)
router.get("/", async (req, res) => {
  try {
    const plans = await Plan.find().populate("trainer", "name");
    res.json(plans);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});
// Get trainer's own plans
router.get("/my-plans", auth, async (req, res) => {
  try {
    const plans = await Plan.find({ trainer: req.user.id });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Get plan details (full if subscribed)
router.get("/:id", auth, async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id).populate("trainer", "name");
    if (!plan) return res.status(404).json({ msg: "Plan not found" });

    // Check if user is subscribed
    const Subscription = require("../models/Subscription");
    const sub = await Subscription.findOne({
      user: req.user.id,
      plan: req.params.id,
    });
    if (sub) {
      res.json(plan);
    } else {
      res.json({ title: plan.title, trainer: plan.trainer, price: plan.price });
    }
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Create plan (trainers only)
router.post("/", auth, async (req, res) => {
  if (req.user.role !== "trainer")
    return res.status(403).json({ msg: "Access denied" });

  const { title, description, price, duration } = req.body;
  try {
    const plan = new Plan({
      title,
      description,
      price,
      duration,
      trainer: req.user.id,
    });
    await plan.save();
    res.json(plan);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Update plan (own plans only)
router.put("/:id", auth, async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan || plan.trainer.toString() !== req.user.id)
      return res.status(403).json({ msg: "Access denied" });

    const { title, description, price, duration } = req.body;
    plan.title = title || plan.title;
    plan.description = description || plan.description;
    plan.price = price || plan.price;
    plan.duration = duration || plan.duration;
    await plan.save();
    res.json(plan);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Delete plan (own plans only)
router.delete("/:id", auth, async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan || plan.trainer.toString() !== req.user.id)
      return res.status(403).json({ msg: "Access denied" });

    await plan.remove();
    res.json({ msg: "Plan deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;

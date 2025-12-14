const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  plan: { type: mongoose.Schema.Types.ObjectId, ref: "Plan", required: true },
  purchasedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Subscription", subscriptionSchema);

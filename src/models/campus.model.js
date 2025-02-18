const mongoose = require("mongoose");

const campusSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  contactPhone: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isAchive: { type: Boolean, default: false },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Campus", campusSchema);

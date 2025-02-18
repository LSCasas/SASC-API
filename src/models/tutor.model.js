const mongoose = require("mongoose");

const tutorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  curp: { type: String, unique: true, required: true },
  phone: { type: String, required: true },
  campusId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campus",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isArchive: { type: Boolean, default: false },
});

module.exports = mongoose.model("Tutor", tutorSchema);

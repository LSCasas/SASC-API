const mongoose = require("mongoose");

const instrumentSchema = new mongoose.Schema({
  internalId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    default: null,
  },
  tutorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tutor",
    default: null,
  },
  campusId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campus",
    required: true,
  },
  assignmentDate: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Instrument", instrumentSchema);

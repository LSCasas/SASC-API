const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: { type: String, required: true },
  curp: { type: String, unique: true, required: true },
  tutorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tutor",
    required: true,
  },
  campusId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campus",
    required: true,
  },
  status: { type: String, default: "activo" },
  gender: { type: String, required: true },
  ClassId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  previousClasses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: false,
    },
  ],
  medicalConditions: { type: String, default: null },
  specialNeeds: { type: String, default: null },
  requiredDocuments: { type: String, default: null },
  hasInstrument: { type: Boolean, default: false },
  birthDate: { type: Date, required: false },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

studentSchema.statics.updateHasInstrument = async function (studentId) {
  const instrumentExists = await mongoose
    .model("Instrument")
    .exists({ studentId });
  await this.findByIdAndUpdate(studentId, {
    hasInstrument: !!instrumentExists,
  });
};

module.exports = mongoose.model("Student", studentSchema);

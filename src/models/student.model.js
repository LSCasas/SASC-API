const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
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
  status: { type: String },
  gender: { type: String },
  ClassId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  medicalConditions: { type: String },
  specialNeeds: { type: String },
  requiredDocuments: { type: String },
  hasInstrument: { type: Boolean, default: false }, // Se actualizará dinámicamente
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

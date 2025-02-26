const mongoose = require("mongoose");

const tutorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  curp: { type: String, required: true }, // Se ha eliminado la restricción de "unique"
  phone: { type: String, required: true },
  campusId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campus",
    required: true,
  },
  children: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student", // Relación con la colección Student
    default: null, // No es obligatorio y por defecto es null
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isArchive: { type: Boolean, default: false },
});

module.exports = mongoose.model("Tutor", tutorSchema);

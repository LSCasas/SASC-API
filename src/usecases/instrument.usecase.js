const Instrument = require("../models/instrument.model");
const Student = require("../models/student.model");
const createError = require("http-errors");

// Create an instrument
const createInstrument = async (data, userId, campusId) => {
  try {
    if (!data.internalId) {
      throw createError(400, "Internal ID is required");
    }

    if (data.studentId) {
      const student = await Student.findById(data.studentId);
      if (!student) throw createError(404, "Student not found");

      data.tutorId = student.tutorId;

      const existingInstrument = await Instrument.findOne({
        studentId: data.studentId,
      });
      if (existingInstrument) {
        throw createError(409, "Student already has an assigned instrument");
      }
    }

    const newInstrument = new Instrument({
      ...data,
      campusId,
      createdBy: userId,
      updatedBy: userId,
      isAchive: false,
    });

    await newInstrument.save();

    if (data.studentId) {
      await Student.updateHasInstrument(data.studentId);
    }

    return newInstrument;
  } catch (error) {
    console.error("Error creating instrument:", error);
    throw createError(500, "Error creating instrument: " + error.message);
  }
};

// Get all instruments
const getAllInstruments = async () => {
  try {
    return await Instrument.find().populate("studentId tutorId campusId");
  } catch (error) {
    throw createError(500, "Error fetching instruments: " + error.message);
  }
};

// Get an instrument by ID
const getInstrumentById = async (id) => {
  try {
    const instrument = await Instrument.findById(id).populate(
      "studentId tutorId campusId"
    );
    if (!instrument) throw createError(404, "Instrument not found");
    return instrument;
  } catch (error) {
    throw createError(500, "Error fetching instrument: " + error.message);
  }
};

// Get instruments by campus ID
const getInstrumentsByCampusId = async (campusId) => {
  try {
    const instruments = await Instrument.find({ campusId }).populate(
      "studentId tutorId campusId"
    );
    if (!instruments.length)
      throw createError(404, "No instruments found for this campus");
    return instruments;
  } catch (error) {
    throw createError(
      500,
      "Error fetching instruments by campus: " + error.message
    );
  }
};

// Update an instrument by ID
const updateInstrument = async (id, data, userId) => {
  try {
    const instrument = await Instrument.findById(id);
    if (!instrument) throw createError(404, "Instrument not found");

    if (data.studentId) {
      const student = await Student.findById(data.studentId);
      if (!student) throw createError(404, "Student not found");

      data.tutorId = student.tutorId;

      const existingInstrument = await Instrument.findOne({
        studentId: data.studentId,
        _id: { $ne: id },
      });

      if (existingInstrument) {
        throw createError(409, "Student already has an assigned instrument");
      }
    } else {
      // Si studentId es null, también se debe limpiar tutorId
      data.tutorId = null;
    }

    const updatedInstrument = await Instrument.findByIdAndUpdate(
      id,
      { ...data, updatedBy: userId },
      { new: true, runValidators: true }
    );

    // Actualiza hasInstrument en los estudiantes involucrados solo si no son nulos
    await Promise.all([
      instrument.studentId
        ? Student.updateHasInstrument(instrument.studentId)
        : Promise.resolve(),
      data.studentId
        ? Student.updateHasInstrument(data.studentId)
        : Promise.resolve(),
    ]);

    return updatedInstrument;
  } catch (error) {
    console.error("Error updating instrument:", error);
    throw createError(500, "Error updating instrument: " + error.message);
  }
};

// Delete an instrument by ID
const deleteInstrument = async (id) => {
  try {
    const instrument = await Instrument.findByIdAndDelete(id);
    if (!instrument) throw createError(404, "Instrument not found");

    // Actualizar hasInstrument en el estudiante afectado
    if (instrument.studentId) {
      await Student.updateHasInstrument(instrument.studentId);
    }

    return instrument;
  } catch (error) {
    throw createError(500, "Error deleting instrument: " + error.message);
  }
};

module.exports = {
  createInstrument,
  getAllInstruments,
  getInstrumentById,
  getInstrumentsByCampusId,
  updateInstrument,
  deleteInstrument,
};

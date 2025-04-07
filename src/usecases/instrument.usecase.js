const Instrument = require("../models/instrument.model");
const Student = require("../models/student.model");
const createError = require("http-errors");

// Create an instrument
const createInstrument = async (data, userId, campusId) => {
  try {
    if (!data.internalId) {
      throw createError(400, "Se requiere identificación interna");
    }

    const existingInstrumentById = await Instrument.findOne({
      internalId: data.internalId,
    });
    if (existingInstrumentById) {
      throw createError(409, "Ya existe un instrumento con ese Folio");
    }

    if (data.studentId) {
      const student = await Student.findById(data.studentId);
      if (!student) throw createError(404, "Estudiante no encontrado");

      data.tutorId = student.tutorId;

      const existingInstrument = await Instrument.findOne({
        studentId: data.studentId,
      });
      if (existingInstrument) {
        throw createError(
          409,
          "El estudiante ya tiene un instrumento asignado. Para asignarle otro, primero debes desasignar el instrumento actual."
        );
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
    console.error("Error al crear el instrumento:", error);
    throw createError(500, "Error al crear el instrumento: " + error.message);
  }
};

// Get all instruments
const getAllInstruments = async () => {
  try {
    return await Instrument.find().populate("studentId tutorId campusId");
  } catch (error) {
    throw createError(
      500,
      "Error al obtener los instrumentos: " + error.message
    );
  }
};

// Get an instrument by ID
const getInstrumentById = async (id) => {
  try {
    const instrument = await Instrument.findById(id).populate(
      "studentId tutorId campusId"
    );
    if (!instrument) throw createError(404, "Instrumento no encontrado");
    return instrument;
  } catch (error) {
    throw createError(500, "Error al obtener el instrumento: " + error.message);
  }
};

// Get instruments by campus ID
const getInstrumentsByCampusId = async (campusId) => {
  try {
    const instruments = await Instrument.find({ campusId }).populate(
      "studentId tutorId campusId"
    );
    return instruments;
  } catch (error) {
    throw createError(
      500,
      "Error al obtener los instrumentos por campus: " + error.message
    );
  }
};

// Update an instrument by ID
const updateInstrument = async (id, data, userId) => {
  try {
    const instrument = await Instrument.findById(id);
    if (!instrument) throw createError(404, "Instrumento no encontrado");

    if (data.studentId) {
      const student = await Student.findById(data.studentId);
      if (!student) throw createError(404, "Estudiante no encontrado");

      data.tutorId = student.tutorId;

      const existingInstrument = await Instrument.findOne({
        studentId: data.studentId,
        _id: { $ne: id },
      });

      if (existingInstrument) {
        throw createError(
          409,
          "El estudiante ya tiene un instrumento asignado. Para asignarle otro, primero debes desasignar el instrumento actual."
        );
      }
    }

    const updatedInstrument = await Instrument.findByIdAndUpdate(
      id,
      { ...data, updatedBy: userId },
      { new: true, runValidators: true }
    );

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
    console.error("Error actualizando el instrumento:", error);
    throw createError(
      500,
      "Error actualizando el instrumento: " + error.message
    );
  }
};

module.exports = {
  createInstrument,
  getAllInstruments,
  getInstrumentById,
  getInstrumentsByCampusId,
  updateInstrument,
};

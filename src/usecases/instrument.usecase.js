const Instrument = require("../models/instrument.model");
const Student = require("../models/student.model");
const createError = require("http-errors");

// Create an instrument
const createInstrument = async (data) => {
  try {
    if (!data.internalId) {
      throw createError(400, "Internal ID is required");
    }

    if (data.studentId) {
      const existingInstrument = await Instrument.findOne({
        studentId: data.studentId,
      });
      if (existingInstrument) {
        throw createError(409, "Student already has an assigned instrument");
      }
    }

    const newInstrument = new Instrument(data);
    await newInstrument.save();
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

// Update an instrument by ID
const updateInstrument = async (id, updateData) => {
  try {
    if (updateData.studentId) {
      const existingInstrument = await Instrument.findOne({
        studentId: updateData.studentId,
      });
      if (existingInstrument && existingInstrument._id.toString() !== id) {
        throw createError(409, "Student already has an assigned instrument");
      }
    }

    const updatedInstrument = await Instrument.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedInstrument) throw createError(404, "Instrument not found");
    return updatedInstrument;
  } catch (error) {
    throw createError(500, "Error updating instrument: " + error.message);
  }
};

// Delete an instrument by ID
const deleteInstrument = async (id) => {
  try {
    const instrument = await Instrument.findByIdAndDelete(id);
    if (!instrument) throw createError(404, "Instrument not found");
    return instrument;
  } catch (error) {
    throw createError(500, "Error deleting instrument: " + error.message);
  }
};

module.exports = {
  createInstrument,
  getAllInstruments,
  getInstrumentById,
  updateInstrument,
  deleteInstrument,
};

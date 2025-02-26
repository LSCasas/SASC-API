const Tutor = require("../models/tutor.model");
const createError = require("http-errors");

// Create a tutor
const createTutor = async ({
  name,
  lastname,
  curp,
  phone,
  campusId,
  children,
}) => {
  try {
    const tutorFound = await Tutor.findOne({ curp });
    if (tutorFound) {
      throw createError(409, "CURP already in use");
    }

    const newTutor = new Tutor({
      name,
      lastname,
      curp,
      phone,
      campusId,
      children,
    });
    await newTutor.save();
    return newTutor;
  } catch (error) {
    console.error("Error creating tutor:", error);
    throw createError(500, "Error creating tutor: " + error.message);
  }
};

// Get all tutors
const getAllTutors = async () => {
  try {
    return await Tutor.find().populate("campusId");
  } catch (error) {
    throw createError(500, "Error fetching tutors: " + error.message);
  }
};

// Get a tutor by ID
const getTutorById = async (id) => {
  try {
    const tutor = await Tutor.findById(id).populate("campusId");
    if (!tutor) throw createError(404, "Tutor not found");
    return tutor;
  } catch (error) {
    throw createError(500, "Error fetching tutor: " + error.message);
  }
};

// Update a tutor by ID
const updateTutor = async (id, updateData) => {
  try {
    const updatedTutor = await Tutor.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedTutor) throw createError(404, "Tutor not found");
    return updatedTutor;
  } catch (error) {
    throw createError(500, "Error updating tutor: " + error.message);
  }
};

// Delete a tutor by ID
const deleteTutor = async (id) => {
  try {
    const tutor = await Tutor.findByIdAndDelete(id);
    if (!tutor) throw createError(404, "Tutor not found");
    return tutor;
  } catch (error) {
    throw createError(500, "Error deleting tutor: " + error.message);
  }
};

// Get tutors by campus ID
const getTutorsByCampusId = async (campusId) => {
  try {
    const tutors = await Tutor.find({ campusId }).populate("campusId");
    if (!tutors.length)
      throw createError(404, "No tutors found for this campus");
    return tutors;
  } catch (error) {
    throw createError(500, "Error fetching tutors by campus: " + error.message);
  }
};

module.exports = {
  createTutor,
  getAllTutors,
  getTutorById,
  getTutorsByCampusId,
  updateTutor,
  deleteTutor,
};

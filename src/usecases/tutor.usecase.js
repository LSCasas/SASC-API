const Tutor = require("../models/tutor.model");
const createError = require("http-errors");
const Student = require("../models/student.model");

// Create a tutor
const createTutor = async ({ name, lastname, phone, campusId, children }) => {
  try {
    const newTutor = new Tutor({ name, lastname, phone, campusId, children });
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
    const tutor = await Tutor.findById(id).populate({
      path: "children",
      select: "firstName lastName ClassId",
      populate: { path: "ClassId", select: "name", model: "Class" },
    });

    if (!tutor) throw createError(404, "Tutor not found");
    return tutor;
  } catch (error) {
    throw createError(500, "Error fetching tutor: " + error.message);
  }
};

// Get tutors by campus ID
const getTutorsByCampusId = async (campusId) => {
  try {
    const tutors = await Tutor.find({ campusId }).populate({
      path: "children",
      select: "firstName lastName ClassId status",
      populate: { path: "ClassId", select: "name", model: "Class" },
    });

    for (let tutor of tutors) {
      const students = await Student.find({ _id: { $in: tutor.children } });

      tutor.isArchive = students.every(
        (student) => student.status !== "activo"
      );

      await tutor.save();
    }

    return tutors;
  } catch (error) {
    throw createError(500, "Error fetching tutors by campus: " + error.message);
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

module.exports = {
  createTutor,
  getAllTutors,
  getTutorById,
  getTutorsByCampusId,
  updateTutor,
};

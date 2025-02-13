const Class = require("../models/class.model");
const Teacher = require("../models/teacher.model"); // Importar el modelo de Teacher
const createError = require("http-errors");

// Create a new class
const createClass = async ({
  name,
  schedule,
  teacherId,
  campusId,
  generation,
}) => {
  try {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) throw createError(404, "Teacher not found");

    if (teacher.campusId.toString() !== campusId.toString()) {
      throw createError(400, "Teacher cannot teach in a different campus");
    }

    const newClass = new Class({
      name,
      schedule,
      teacherId,
      campusId,
      generation,
    });
    await newClass.save();
    return newClass;
  } catch (error) {
    console.error("Error creating class:", error);
    throw createError(500, "Error creating class: " + error.message);
  }
};

// Get all classes
const getAllClasses = async () => {
  try {
    return await Class.find().populate("teacherId").populate("campusId");
  } catch (error) {
    throw createError(500, "Error fetching classes: " + error.message);
  }
};

// Get a class by ID
const getClassById = async (id) => {
  try {
    const classData = await Class.findById(id)
      .populate("teacherId")
      .populate("campusId");
    if (!classData) throw createError(404, "Class not found");
    return classData;
  } catch (error) {
    throw createError(500, "Error fetching class: " + error.message);
  }
};

// Update a class by ID
const updateClass = async (id, updateData) => {
  try {
    const updatedClass = await Class.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    const teacher = await Teacher.findById(updateData.teacherId);
    if (!teacher) throw createError(404, "Teacher not found");

    if (teacher.campusId.toString() !== updateData.campusId.toString()) {
      throw createError(400, "Teacher cannot teach in a different campus");
    }

    if (!updatedClass) throw createError(404, "Class not found");
    return updatedClass;
  } catch (error) {
    throw createError(500, "Error updating class: " + error.message);
  }
};

// Delete a class by ID
const deleteClass = async (id) => {
  try {
    const classData = await Class.findByIdAndDelete(id);
    if (!classData) throw createError(404, "Class not found");
    return classData;
  } catch (error) {
    throw createError(500, "Error deleting class: " + error.message);
  }
};

module.exports = {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
};

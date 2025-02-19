const Class = require("../models/class.model");
const Teacher = require("../models/teacher.model"); // Importar el modelo de Teacher
const createError = require("http-errors");

// Create a new class
const createClass = async (data, campusId, userId) => {
  try {
    const teacher = await Teacher.findById(data.teacherId);
    if (!teacher) throw createError(404, "Teacher not found");

    // Verificar que el teacher esté asignado al campus correcto
    if (teacher.campusId.toString() !== campusId.toString()) {
      throw createError(400, "Teacher cannot teach in a different campus");
    }

    const newClass = new Class({
      ...data,
      campusId: campusId, // Usar campusId desde el token
      createdBy: userId, // Usar userId desde el token
      updatedBy: userId,
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

// Get classes by campus ID
const getClassesByCampusId = async (campusId) => {
  try {
    const classes = await Class.find({ campusId })
      .populate("teacherId")
      .populate("campusId");
    if (!classes.length)
      throw createError(404, "No classes found for this campus");
    return classes;
  } catch (error) {
    throw createError(
      500,
      "Error fetching classes by campus: " + error.message
    );
  }
};

// Update a class by ID
const updateClass = async (id, updateData, userId) => {
  try {
    const updatedClass = await Class.findByIdAndUpdate(
      id,
      {
        ...updateData,
        updatedBy: userId, // Actualizamos el ID del usuario que hace la modificación
      },
      { new: true, runValidators: true }
    );

    const teacher = await Teacher.findById(updateData.teacherId);
    if (!teacher) throw createError(404, "Teacher not found");

    // Verificar que el teacher esté asignado al campus correcto
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
  getClassesByCampusId,
  updateClass,
  deleteClass,
};

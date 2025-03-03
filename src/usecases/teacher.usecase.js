const Teacher = require("../models/teacher.model");
const createError = require("http-errors");

// Create a new teacher
const createTeacher = async (data, campusId, userId) => {
  try {
    const newTeacher = new Teacher({
      ...data,
      campusId: campusId,
      createdBy: userId,
      updatedBy: userId,
    });

    await newTeacher.save();
    return newTeacher;
  } catch (error) {
    console.error("Error creating teacher:", error);
    throw createError(500, "Error creating teacher: " + error.message);
  }
};

// Get all teachers
const getAllTeachers = async () => {
  try {
    return await Teacher.find().populate("campusId");
  } catch (error) {
    throw createError(500, "Error fetching teachers: " + error.message);
  }
};

// Get a teacher by ID
const getTeacherById = async (id) => {
  try {
    const teacher = await Teacher.findById(id).populate("campusId");
    if (!teacher) throw createError(404, "Profesor no encontrado");
    return teacher;
  } catch (error) {
    throw createError(500, "Error al obtener el profesor: " + error.message);
  }
};

// Get teachers by campus ID
const getTeachersByCampusId = async (campusId) => {
  try {
    const teachers = await Teacher.find({ campusId }).populate("campusId");
    if (!teachers.length)
      throw createError(404, "No se encontraron profesores para este campus");
    return teachers;
  } catch (error) {
    throw createError(
      500,
      "Error al obtener los profesores por campus: " + error.message
    );
  }
};

// Update a teacher by ID
const updateTeacher = async (id, updateData, userId) => {
  try {
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      id,
      {
        ...updateData,
        updatedBy: userId,
      },
      { new: true, runValidators: true }
    );
    if (!updatedTeacher) throw createError(404, "Profesor no encontrado");
    return updatedTeacher;
  } catch (error) {
    console.error("Error al actualizar el profesor:", error);
    throw createError(500, "Error al actualizar el profesor: " + error.message);
  }
};

module.exports = {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  getTeachersByCampusId,
  updateTeacher,
};

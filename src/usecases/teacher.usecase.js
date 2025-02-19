const Teacher = require("../models/teacher.model");
const createError = require("http-errors");

// Create a new teacher
const createTeacher = async (
  { firstName, lastName, phone, email },
  campusIdFromToken
) => {
  try {
    const teacherFound = await Teacher.findOne({ email });
    if (teacherFound) {
      throw createError(409, "Email already in use");
    }

    // Crear el nuevo maestro con el campusId del token
    const newTeacher = new Teacher({
      firstName,
      lastName,
      phone,
      email,
      campusId: campusIdFromToken, // Asignar campusId desde el token
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
    if (!teacher) throw createError(404, "Teacher not found");
    return teacher;
  } catch (error) {
    throw createError(500, "Error fetching teacher: " + error.message);
  }
};

// Get teachers by campus ID
const getTeachersByCampusId = async (campusId) => {
  try {
    const teachers = await Teacher.find({ campusId }).populate("campusId");
    if (!teachers.length)
      throw createError(404, "No teachers found for this campus");
    return teachers;
  } catch (error) {
    throw createError(
      500,
      "Error fetching teachers by campus: " + error.message
    );
  }
};

// Update a teacher by ID
const updateTeacher = async (id, updateData) => {
  try {
    const updatedTeacher = await Teacher.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedTeacher) throw createError(404, "Teacher not found");
    return updatedTeacher;
  } catch (error) {
    throw createError(500, "Error updating teacher: " + error.message);
  }
};

// Delete a teacher by ID
const deleteTeacher = async (id) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(id);
    if (!teacher) throw createError(404, "Teacher not found");
    return teacher;
  } catch (error) {
    throw createError(500, "Error deleting teacher: " + error.message);
  }
};

module.exports = {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  getTeachersByCampusId,
  updateTeacher,
  deleteTeacher,
};

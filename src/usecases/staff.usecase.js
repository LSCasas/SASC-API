const Staff = require("../models/staff.model");
const createError = require("http-errors");

// Create a new staff
const createStaff = async (data, campusId, userId) => {
  try {
    const newStaff = new Staff({
      ...data,
      campusId: campusId,
      createdBy: userId,
      updatedBy: userId,
    });

    await newStaff.save();
    return newStaff;
  } catch (error) {
    console.error("Error creating staff:", error);
    throw createError(500, "Error creating staff: " + error.message);
  }
};

// Get all staffs
const getAllStaffs = async () => {
  try {
    return await Staff.find().populate("campusId");
  } catch (error) {
    throw createError(500, "Error fetching staffs: " + error.message);
  }
};

// Get a staff by ID
const getStaffById = async (id) => {
  try {
    const staff = await Staff.findById(id).populate("campusId");
    if (!staff) throw createError(404, "Profesor no encontrado");
    return staff;
  } catch (error) {
    throw createError(500, "Error al obtener el profesor: " + error.message);
  }
};

// Get staffs by campus ID
const getStaffsByCampusId = async (campusId) => {
  try {
    const staffs = await Staff.find({ campusId }).populate("campusId");
    return staffs;
  } catch (error) {
    throw createError(
      500,
      "Error al obtener los profesores por campus: " + error.message
    );
  }
};

// Update a staff by ID
const updateStaff = async (id, updateData, userId) => {
  try {
    const updatedStaff = await Staff.findByIdAndUpdate(
      id,
      {
        ...updateData,
        updatedBy: userId,
      },
      { new: true, runValidators: true }
    );
    if (!updatedStaff) throw createError(404, "Profesor no encontrado");
    return updatedStaff;
  } catch (error) {
    console.error("Error al actualizar el profesor:", error);
    throw createError(500, "Error al actualizar el profesor: " + error.message);
  }
};

module.exports = {
  createStaff,
  getAllStaffs,
  getStaffById,
  getStaffsByCampusId,
  updateStaff,
};

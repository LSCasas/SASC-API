const Campus = require("../models/campus.model");
const User = require("../models/user.model");
const createError = require("http-errors");

// Create a new campus
const createCampus = async ({ name, address, contactPhone }, userId) => {
  try {
    const newCampus = new Campus({
      name,
      address,
      contactPhone,
      createdBy: userId,
      updatedBy: userId,
    });

    await newCampus.save();

    const admins = await User.find({ role: "admin", isArchived: false });

    for (let admin of admins) {
      if (!admin.campusId.includes(newCampus._id)) {
        admin.campusId.push(newCampus._id);
        await admin.save();
      }
    }

    return newCampus;
  } catch (error) {
    console.error("Error al crear el campus:", error);
    throw createError(500, "Error al crear el campus: " + error.message);
  }
};

// Get all campuses
const getAllCampuses = async () => {
  try {
    return await Campus.find();
  } catch (error) {
    throw createError(500, "Error al obtener los campus: " + error.message);
  }
};

// Get a campus by ID
const getCampusById = async (id) => {
  try {
    const campus = await Campus.findById(id);
    if (!campus) throw createError(404, "Campus no encontrado");
    return campus;
  } catch (error) {
    throw createError(500, "Error al obtener los campus: " + error.message);
  }
};

// Update a campus by ID
const updateCampus = async (id, updateData, userId) => {
  try {
    const updatedCampus = await Campus.findByIdAndUpdate(
      id,
      {
        ...updateData,
        updatedBy: userId,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCampus) throw createError(404, "Campus no encontrado");
    return updatedCampus;
  } catch (error) {
    throw createError(500, "Error al actualizar el campus: " + error.message);
  }
};

module.exports = {
  createCampus,
  getAllCampuses,
  getCampusById,
  updateCampus,
};

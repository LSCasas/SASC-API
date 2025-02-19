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

    const admins = await User.find({ role: "admin" });
    for (let admin of admins) {
      if (!admin.campusId.includes(newCampus._id)) {
        admin.campusId.push(newCampus._id);
        await admin.save();
      }
    }

    return newCampus;
  } catch (error) {
    console.error("Error creating campus:", error);
    throw createError(500, "Error creating campus: " + error.message);
  }
};

// Get all campuses
const getAllCampuses = async () => {
  try {
    return await Campus.find();
  } catch (error) {
    throw createError(500, "Error fetching campuses: " + error.message);
  }
};

// Get a campus by ID
const getCampusById = async (id) => {
  try {
    const campus = await Campus.findById(id);
    if (!campus) throw createError(404, "Campus not found");
    return campus;
  } catch (error) {
    throw createError(500, "Error fetching campus: " + error.message);
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

    if (!updatedCampus) throw createError(404, "Campus not found");
    return updatedCampus;
  } catch (error) {
    throw createError(500, "Error updating campus: " + error.message);
  }
};

// Delete a campus by ID
const deleteCampus = async (id) => {
  try {
    const campus = await Campus.findByIdAndDelete(id);
    if (!campus) throw createError(404, "Campus not found");
    return campus;
  } catch (error) {
    throw createError(500, "Error deleting campus: " + error.message);
  }
};

module.exports = {
  createCampus,
  getAllCampuses,
  getCampusById,
  updateCampus,
  deleteCampus,
};

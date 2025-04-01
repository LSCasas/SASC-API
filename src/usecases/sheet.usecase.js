const Sheet = require("../models/sheet.model");
const createError = require("http-errors");

// Create a new sheet
const createSheet = async (data, userId) => {
  try {
    const newSheet = new Sheet({
      ...data,
      createdBy: userId,
      updatedBy: userId,
    });

    await newSheet.save();
    return newSheet;
  } catch (error) {
    console.error("Error creating sheet:", error);
    throw createError(500, "Error creating sheet: " + error.message);
  }
};

// Get all sheets
const getAllSheets = async () => {
  try {
    return await Sheet.find().populate("createdBy updatedBy");
  } catch (error) {
    throw createError(500, "Error fetching sheets: " + error.message);
  }
};

// Get a sheet by ID
const getSheetById = async (id) => {
  try {
    const sheet = await Sheet.findById(id).populate("createdBy updatedBy");
    if (!sheet) throw createError(404, "Sheet not found");
    return sheet;
  } catch (error) {
    throw createError(500, "Error fetching sheet: " + error.message);
  }
};

// Update a sheet by ID
const updateSheet = async (id, updateData, userId) => {
  try {
    const updatedSheet = await Sheet.findByIdAndUpdate(
      id,
      {
        ...updateData,
        updatedBy: userId,
        updatedAt: Date.now(),
      },
      { new: true, runValidators: true }
    );
    if (!updatedSheet) throw createError(404, "Sheet not found");
    return updatedSheet;
  } catch (error) {
    console.error("Error updating sheet:", error);
    throw createError(500, "Error updating sheet: " + error.message);
  }
};

module.exports = {
  createSheet,
  getAllSheets,
  getSheetById,
  updateSheet,
};

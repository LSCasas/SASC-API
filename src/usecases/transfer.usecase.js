const Transfer = require("../models/transfer.model");
const Student = require("../models/student.model");
const Class = require("../models/class.model");
const createError = require("http-errors");

// Create a transfer
const createTransfer = async (data) => {
  try {
    // Ensure the student exists
    const student = await Student.findById(data.studentId);
    if (!student) {
      throw createError(404, "Student not found");
    }

    // Ensure the origin and destination locations are different
    if (
      data.originLocationId.toString() === data.destinationLocationId.toString()
    ) {
      throw createError(
        400,
        "The origin and destination campuses cannot be the same"
      );
    }

    // Ensure the student is currently in the origin campus
    if (student.campusId.toString() !== data.originLocationId.toString()) {
      throw createError(
        400,
        "The student is not currently at the specified origin campus"
      );
    }

    // Ensure the origin and destination classes are valid
    const originClass = await Class.findById(data.originClass);
    const destinationClass = await Class.findById(data.destinationClass);
    if (!originClass || !destinationClass) {
      throw createError(404, "One or both classes are not found");
    }

    // Validate that the origin class belongs to the origin campus
    if (originClass.campusId.toString() !== data.originLocationId.toString()) {
      throw createError(
        400,
        "The origin class does not belong to the origin campus"
      );
    }

    // Validate that the destination class belongs to the destination campus
    if (
      destinationClass.campusId.toString() !==
      data.destinationLocationId.toString()
    ) {
      throw createError(
        400,
        "The destination class does not belong to the destination campus"
      );
    }

    // Create the transfer record
    const transfer = new Transfer(data);
    await transfer.save();

    // Update the student's campus and class information
    student.campusId = data.destinationLocationId;
    student.ClassId = data.destinationClass;
    await student.save();

    return transfer;
  } catch (error) {
    console.error("Error creating transfer:", error);
    throw createError(500, "Error creating transfer: " + error.message);
  }
};

// Get all transfers
const getAllTransfers = async () => {
  try {
    return await Transfer.find().populate(
      "studentId originLocationId destinationLocationId originClass destinationClass"
    );
  } catch (error) {
    throw createError(500, "Error fetching transfers: " + error.message);
  }
};

// Get a transfer by ID
const getTransferById = async (id) => {
  try {
    const transfer = await Transfer.findById(id).populate(
      "studentId originLocationId destinationLocationId originClass destinationClass"
    );
    if (!transfer) throw createError(404, "Transfer not found");
    return transfer;
  } catch (error) {
    throw createError(500, "Error fetching transfer: " + error.message);
  }
};

// Update a transfer by ID
const updateTransfer = async (id, updateData) => {
  try {
    const updatedTransfer = await Transfer.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedTransfer) throw createError(404, "Transfer not found");
    return updatedTransfer;
  } catch (error) {
    throw createError(500, "Error updating transfer: " + error.message);
  }
};

// Delete a transfer by ID
const deleteTransfer = async (id) => {
  try {
    const transfer = await Transfer.findByIdAndDelete(id);
    if (!transfer) throw createError(404, "Transfer not found");
    return transfer;
  } catch (error) {
    throw createError(500, "Error deleting transfer: " + error.message);
  }
};

module.exports = {
  createTransfer,
  getAllTransfers,
  getTransferById,
  updateTransfer,
  deleteTransfer,
};

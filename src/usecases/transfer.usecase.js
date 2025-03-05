const Transfer = require("../models/transfer.model");
const Student = require("../models/student.model");
const Class = require("../models/class.model");
const createError = require("http-errors");
const Tutor = require("../models/tutor.model");

// Create a transfer
const createTransfer = async (data, userId) => {
  try {
    const student = await Student.findById(data.studentId);
    if (!student) {
      throw createError(404, "Estudiante no encontrado");
    }

    if (student.hasInstrument) {
      throw createError(
        400,
        "Debe devolver el instrumento primero, para poder ser transferido"
      );
    }

    if (
      data.originLocationId.toString() === data.destinationLocationId.toString()
    ) {
      throw createError(
        400,
        "Los campus de origen y destino no pueden ser los mismos"
      );
    }

    if (student.campusId.toString() !== data.originLocationId.toString()) {
      throw createError(
        400,
        "El estudiante no se encuentra actualmente en el campus de origen especificado."
      );
    }

    const originClass = await Class.findById(data.originClass);
    const destinationClass = await Class.findById(data.destinationClass);
    if (!originClass || !destinationClass) {
      throw createError(404, "No se encuentran una o ambas clases");
    }

    if (originClass.campusId.toString() !== data.originLocationId.toString()) {
      throw createError(
        400,
        "La clase de origen no pertenece al campus de origen."
      );
    }

    if (
      destinationClass.campusId.toString() !==
      data.destinationLocationId.toString()
    ) {
      throw createError(
        400,
        "La clase de destino no pertenece al campus de destino."
      );
    }

    const tutor = await Tutor.findById(student.tutorId);
    if (!tutor) {
      throw createError(404, "Tutor no encontrado");
    }

    tutor.campusId = data.destinationLocationId;
    await tutor.save();

    const transferData = {
      ...data,
      createdBy: userId,
      updatedBy: userId,
      tutorId: student.tutorId,
    };

    const transfer = new Transfer(transferData);
    await transfer.save();

    student.campusId = data.destinationLocationId;
    student.ClassId = data.destinationClass;
    await student.save();

    return transfer;
  } catch (error) {
    console.error("Error al crear la transferencia:", error);
    throw createError(500, "Error al crear la transferencia: " + error.message);
  }
};

// Get all transfers
const getAllTransfers = async () => {
  try {
    return await Transfer.find().populate(
      "studentId originLocationId destinationLocationId originClass destinationClass"
    );
  } catch (error) {
    throw createError(
      500,
      "Error al obtener las transferencias: " + error.message
    );
  }
};

// Get a transfer by ID
const getTransferById = async (id) => {
  try {
    const transfer = await Transfer.findById(id).populate(
      "studentId originLocationId destinationLocationId originClass destinationClass"
    );
    if (!transfer) throw createError(404, "Transferencia no encontrada");
    return transfer;
  } catch (error) {
    throw createError(
      500,
      "Error al obtener la transferencia: " + error.message
    );
  }
};

// Get transfers by campus ID
const getTransfersByCampusId = async (campusId) => {
  try {
    const transfers = await Transfer.find({
      $or: [
        { originLocationId: campusId },
        { destinationLocationId: campusId },
      ],
    }).populate(
      "studentId originLocationId destinationLocationId originClass destinationClass"
    );

    return transfers;
  } catch (error) {
    throw createError(
      500,
      "Error al obtener las transferencias por campus: " + error.message
    );
  }
};

// Update a transfer by ID
const updateTransfer = async (id, updateData) => {
  try {
    const updatedTransfer = await Transfer.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedTransfer) throw createError(404, "Transferencia no encontrada");
    return updatedTransfer;
  } catch (error) {
    throw createError(
      500,
      "Error al actualizar la transferencia: " + error.message
    );
  }
};

module.exports = {
  createTransfer,
  getAllTransfers,
  getTransferById,
  getTransfersByCampusId,
  updateTransfer,
};

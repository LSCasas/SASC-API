const Class = require("../models/class.model");
const Teacher = require("../models/teacher.model");
const createError = require("http-errors");

// Create a new class
const createClass = async (data, campusId, userId) => {
  try {
    if (data.teacherId) {
      const teacher = await Teacher.findById(data.teacherId);
      if (!teacher) throw createError(404, "Profesor no encontrado");

      if (teacher.campusId.toString() !== campusId.toString()) {
        throw createError(
          400,
          "El maestro no puede enseñar en un campus diferente"
        );
      }
    }

    const validDays = [
      "Lunes",
      "Martes",
      "Miercoles",
      "Jueves",
      "Viernes",
      "Sabado",
      "Domingo",
    ];

    if (!data.schedule || typeof data.schedule !== "object") {
      throw createError(400, "El horario debe ser un objeto válido.");
    }

    for (const [day, times] of Object.entries(data.schedule)) {
      if (!validDays.includes(day)) {
        throw createError(400, `Día inválido: ${day}`);
      }
      if (!times.startTime || !times.endTime) {
        throw createError(400, `Falta horario en ${day}`);
      }
      if (times.startTime >= times.endTime) {
        throw createError(
          400,
          `La hora de inicio debe ser menor a la de finalización en ${day}`
        );
      }
    }

    const newClass = new Class({
      ...data,
      campusId: campusId,
      createdBy: userId,
      updatedBy: userId,
    });

    await newClass.save();
    return newClass;
  } catch (error) {
    console.error("Error al crear la clase:", error);
    throw createError(500, "Error al crear la clase: " + error.message);
  }
};

// Get all classes
const getAllClasses = async () => {
  try {
    return await Class.find().populate("teacherId").populate("campusId");
  } catch (error) {
    throw createError(500, "Error al obtener las clases: " + error.message);
  }
};

// Get a class by ID
const getClassById = async (id) => {
  try {
    const classData = await Class.findById(id)
      .populate("teacherId")
      .populate("campusId");
    if (!classData) throw createError(404, "Clase no encontrada");
    return classData;
  } catch (error) {
    throw createError(500, "Error al obtener la clase: " + error.message);
  }
};

// Get classes by campus ID
const getClassesByCampusId = async (campusId) => {
  try {
    const classes = await Class.find({ campusId })
      .populate("teacherId")
      .populate("campusId");
    return classes;
  } catch (error) {
    throw createError(
      500,
      "Error al obtener las clases por campus: " + error.message
    );
  }
};

// Update a class by ID
const updateClass = async (id, updateData, userId) => {
  try {
    if (updateData.teacherId) {
      const teacher = await Teacher.findById(updateData.teacherId);
      if (!teacher) throw createError(404, "Profesor no encontrado");

      const classData = await Class.findById(id);
      if (
        classData &&
        teacher.campusId.toString() !== classData.campusId.toString()
      ) {
        throw createError(
          400,
          "El profesor no puede enseñar en un campus diferente"
        );
      }
    }

    if (updateData.schedule) {
      const validDays = [
        "Lunes",
        "Martes",
        "Miercoles",
        "Jueves",
        "Viernes",
        "Sabado",
        "Domingo",
      ];

      for (const [day, times] of Object.entries(updateData.schedule)) {
        if (!validDays.includes(day)) {
          throw createError(400, `Día inválido: ${day}`);
        }
        if (!times.startTime || !times.endTime) {
          throw createError(400, `Falta horario en ${day}`);
        }
        if (times.startTime >= times.endTime) {
          throw createError(
            400,
            `La hora de inicio debe ser menor a la de finalización en ${day}`
          );
        }
      }
    }

    const updateFields = {
      updatedBy: userId,
      updatedAt: Date.now(),
    };

    if (updateData.name) updateFields.name = updateData.name;
    if (updateData.teacherId !== undefined)
      updateFields.teacherId = updateData.teacherId;
    if (updateData.generation) updateFields.generation = updateData.generation;
    if (updateData.schedule) updateFields.schedule = updateData.schedule;
    if (updateData.isAchive !== undefined)
      updateFields.isAchive = updateData.isAchive;

    const updatedClass = await Class.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedClass) throw createError(404, "Clase no encontrada");

    return updatedClass;
  } catch (error) {
    console.error("Error al actualizar la clase:", error);
    throw createError(500, "Error al actualizar la clase: " + error.message);
  }
};

module.exports = {
  createClass,
  getAllClasses,
  getClassById,
  getClassesByCampusId,
  updateClass,
};

const Class = require("../models/class.model");
const Teacher = require("../models/teacher.model");
const createError = require("http-errors");

// Crear una nueva clase
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

    if (data.startTime >= data.endTime) {
      throw createError(
        400,
        "La hora de inicio debe ser anterior a la hora de finalización."
      );
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
    const invalidDays = data.days.filter((day) => !validDays.includes(day));
    if (invalidDays.length > 0) {
      throw createError(400, `Días inválidos: ${invalidDays.join(", ")}`);
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

// Obtener todas las clases
const getAllClasses = async () => {
  try {
    return await Class.find().populate("teacherId").populate("campusId");
  } catch (error) {
    throw createError(500, "Error al obtener las clases: " + error.message);
  }
};

// Obtener una clase por ID
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

// Obtener clases por campus ID
const getClassesByCampusId = async (campusId) => {
  try {
    const classes = await Class.find({ campusId })
      .populate("teacherId")
      .populate("campusId");
    if (!classes.length)
      throw createError(404, "No se encontraron clases para este campus");
    return classes;
  } catch (error) {
    throw createError(
      500,
      "Error al obtener las clases por campus: " + error.message
    );
  }
};

// Actualizar una clase por ID
const updateClass = async (id, updateData, userId) => {
  try {
    if (updateData.teacherId) {
      const teacher = await Teacher.findById(updateData.teacherId);
      if (!teacher) {
        throw createError(404, "Profesor no encontrado");
      }

      const { campusId } = teacher;
      const classData = await Class.findById(id);

      if (classData && campusId.toString() !== classData.campusId.toString()) {
        throw createError(
          400,
          "El profesor no puede enseñar en un campus diferente"
        );
      }
    }

    if (updateData.startTime && updateData.endTime) {
      if (updateData.startTime >= updateData.endTime) {
        throw createError(
          400,
          "La hora de inicio debe ser anterior a la hora de finalización"
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

    if (updateData.days && Array.isArray(updateData.days)) {
      updateData.days = updateData.days.map(
        (day) => day.charAt(0).toUpperCase() + day.slice(1).toLowerCase()
      );

      const invalidDays = updateData.days.filter(
        (day) => !validDays.includes(day)
      );
      if (invalidDays.length > 0) {
        throw createError(400, `Días inválidos: ${invalidDays.join(", ")}`);
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
    if (updateData.days) updateFields.days = updateData.days;
    if (updateData.startTime) updateFields.startTime = updateData.startTime;
    if (updateData.endTime) updateFields.endTime = updateData.endTime;
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
    console.error(" Error al actualizar la clase:", error.message);
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

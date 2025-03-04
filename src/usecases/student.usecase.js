const Student = require("../models/student.model");
const Tutor = require("../models/tutor.model");
const createError = require("http-errors");
const Campus = require("../models/campus.model");

// Create a student
const createStudent = async (data, campusId, userId) => {
  try {
    const studentFound = await Student.findOne({ curp: data.curp }).populate(
      "campusId"
    );

    if (studentFound) {
      if (studentFound.campusId._id.toString() === campusId) {
        throw createError(
          409,
          "Este estudiante ya está registrado en tu campus."
        );
      } else {
        throw createError(
          409,
          `Este estudiante ya está registrado en el campus: ${studentFound.campusId.name}. Debes transferirlo de ese campus para poder registrarlo en tu campus.`
        );
      }
    }

    let tutorId;

    let tutor = await Tutor.findOne({ curp: data.tutorCurp });

    if (!tutor) {
      tutor = new Tutor({
        name: data.tutorName,
        lastname: data.tutorLastname,
        curp: data.tutorCurp,
        phone: data.tutorPhone,
        campusId: campusId,
      });
      await tutor.save();
    }

    tutorId = tutor._id;

    const newStudent = new Student({
      ...data,
      tutorId,
      campusId: campusId,
      createdBy: userId,
      updatedBy: userId,
    });

    await newStudent.save();

    tutor.children.push(newStudent._id);
    await tutor.save();

    return newStudent;
  } catch (error) {
    console.error("Error al crear el estudiante:", error);
    throw createError(500, "Error al crear el estudiante: " + error.message);
  }
};

// Get all students
const getAllStudents = async () => {
  try {
    return await Student.find().populate("tutorId campusId ClassId");
  } catch (error) {
    throw createError(
      500,
      "Error al obtener los estudiantes: " + error.message
    );
  }
};

// Get a student by ID
const getStudentById = async (id) => {
  try {
    const student = await Student.findById(id)
      .populate("tutorId campusId ClassId")
      .populate({
        path: "previousClasses",
        populate: {
          path: "teacherId campusId",
          select: "name schedule teacherId campusId",
        },
      });

    if (!student) throw createError(404, "Estudiante no encontrado");
    return student;
  } catch (error) {
    throw createError(500, "Error al obtener el estudiante: " + error.message);
  }
};

// Get students by campus ID
const getStudentsByCampusId = async (campusId) => {
  try {
    const students = await Student.find({ campusId })
      .populate("tutorId campusId ClassId")
      .populate({
        path: "previousClasses",
        populate: {
          path: "teacherId campusId",
          select: "name schedule teacherId campusId",
        },
      });

    return students;
  } catch (error) {
    throw createError(
      500,
      "Error al obtener los estudiantes por campus: " + error.message
    );
  }
};

// Update a student by ID
const updateStudent = async (id, updateData, userId) => {
  try {
    const student = await Student.findById(id);
    if (!student) throw createError(404, "Student not found");

    if (updateData.curp) {
      const existingStudent = await Student.findOne({ curp: updateData.curp });
      if (existingStudent && existingStudent._id.toString() !== id) {
        const existingCampus = await Campus.findById(existingStudent.campusId);
        throw createError(
          409,
          `Este estudiante ya está registrado en el campus: ${existingCampus.name}. No puedes actualizar a este estudiante con el mismo CURP que otro.`
        );
      }
    }

    const newClassId = String(updateData.ClassId || "");
    const currentClassId = String(student.ClassId || "");

    let updatedPreviousClasses = [...student.previousClasses];

    if (newClassId && newClassId !== currentClassId) {
      if (currentClassId && !updatedPreviousClasses.includes(currentClassId)) {
        updatedPreviousClasses.push(currentClassId);
      }
    }

    if (
      updateData.tutorId ||
      updateData.tutorName ||
      updateData.tutorLastname ||
      updateData.tutorPhone
    ) {
      const tutor = await Tutor.findById(student.tutorId);
      if (!tutor) throw createError(404, "Tutor not found");

      if (updateData.tutorName) tutor.name = updateData.tutorName;
      if (updateData.tutorLastname) tutor.lastname = updateData.tutorLastname;
      if (updateData.tutorPhone) tutor.phone = updateData.tutorPhone;

      await tutor.save();
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      {
        ...updateData,
        ClassId: newClassId,
        previousClasses:
          updatedPreviousClasses.length > 0
            ? updatedPreviousClasses
            : student.previousClasses,
        updatedBy: userId,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedStudent) throw createError(404, "Estudiante no encontrado");
    return updatedStudent;
  } catch (error) {
    throw createError(500, "Error al actualizar estudiante: " + error.message);
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  getStudentsByCampusId,
  updateStudent,
};

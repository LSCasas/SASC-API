const Student = require("../models/student.model");
const Tutor = require("../models/tutor.model");
const createError = require("http-errors");
const Campus = require("../models/campus.model");
// Create a student
const createStudent = async (data, campusId, userId) => {
  try {
    const studentFound = await Student.findOne({ curp: data.curp });
    if (studentFound) {
      throw createError(409, "CURP already exists");
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
    console.error("Error creating student:", error);
    throw createError(500, "Error creating student: " + error.message);
  }
};

// Get all students
const getAllStudents = async () => {
  try {
    return await Student.find().populate("tutorId campusId ClassId");
  } catch (error) {
    throw createError(500, "Error fetching students: " + error.message);
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

    if (!student) throw createError(404, "Student not found");
    return student;
  } catch (error) {
    throw createError(500, "Error fetching student: " + error.message);
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

    if (!students || students.length === 0) {
      throw createError(404, "No students found for this campus");
    }

    return students;
  } catch (error) {
    throw createError(
      500,
      "Error fetching students by campus: " + error.message
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
          `This student is already registered in the campus: ${existingCampus.name}. You cant update this student with the same curp.`
        );
      }
    }

    if (updateData.ClassId && student.ClassId !== updateData.ClassId) {
      if (!student.previousClasses.includes(student.ClassId)) {
        student.previousClasses.push(student.ClassId);
        await student.save();
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
        updatedBy: userId,
      },
      { new: true, runValidators: true }
    );

    if (!updatedStudent) throw createError(404, "Student not found");
    return updatedStudent;
  } catch (error) {
    throw createError(500, "Error updating student: " + error.message);
  }
};

// Delete a student by ID
const deleteStudent = async (id) => {
  try {
    const student = await Student.findByIdAndDelete(id);
    if (!student) throw createError(404, "Student not found");
    return student;
  } catch (error) {
    throw createError(500, "Error deleting student: " + error.message);
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  getStudentsByCampusId,
  updateStudent,
  deleteStudent,
};

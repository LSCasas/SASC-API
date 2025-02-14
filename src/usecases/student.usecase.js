const Student = require("../models/student.model");
const Tutor = require("../models/tutor.model");
const createError = require("http-errors");

// Create a student
const createStudent = async (data) => {
  try {
    const studentFound = await Student.findOne({ curp: data.curp });
    if (studentFound) {
      throw createError(409, "CURP already exists");
    }

    let tutorId;

    if (data.tutorId) {
      tutorId = data.tutorId;
    } else {
      let tutor = await Tutor.findOne({ curp: data.tutorCurp });
      if (!tutor) {
        tutor = new Tutor({
          name: data.tutorName,
          lastname: data.tutorLastname,
          curp: data.tutorCurp,
          phone: data.tutorPhone,
          campusId: data.campusId,
        });
        await tutor.save();
      }
      tutorId = tutor._id;
    }

    const newStudent = new Student({
      ...data,
      tutorId,
    });
    await newStudent.save();

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
    const student = await Student.findById(id).populate(
      "tutorId campusId ClassId"
    );
    if (!student) throw createError(404, "Student not found");
    return student;
  } catch (error) {
    throw createError(500, "Error fetching student: " + error.message);
  }
};

// Get students by campus ID
const getStudentsByCampusId = async (campusId) => {
  try {
    const students = await Student.find({ campusId }).populate(
      "tutorId campusId ClassId"
    );
    if (!students.length)
      throw createError(404, "No students found for this campus");
    return students;
  } catch (error) {
    throw createError(
      500,
      "Error fetching students by campus: " + error.message
    );
  }
};

// Update a student by ID
const updateStudent = async (id, updateData) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
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

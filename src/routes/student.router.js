const express = require("express");
const router = express.Router();
const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require("../usecases/student.usecase");

// Create a new student
router.post("/", async (req, res) => {
  try {
    const newStudent = await createStudent(req.body);
    res.status(201).json({
      success: true,
      data: newStudent,
    });
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get all students
router.get("/", async (req, res) => {
  try {
    const students = await getAllStudents();
    res.json({
      success: true,
      data: students,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching students",
    });
  }
});

// Get a student by ID
router.get("/:id", async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await getStudentById(studentId);
    res.json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error("Error fetching student by ID:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

// Update a student by ID
router.patch("/:id", async (req, res) => {
  try {
    const studentId = req.params.id;
    const updatedStudent = await updateStudent(studentId, req.body);
    res.json({
      success: true,
      data: updatedStudent,
    });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

// Delete a student by ID
router.delete("/:id", async (req, res) => {
  try {
    const studentId = req.params.id;
    await deleteStudent(studentId);
    res.json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;

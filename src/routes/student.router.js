const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  createStudent,
  getAllStudents,
  getStudentById,
  getStudentsByCampusId,
  updateStudent,
} = require("../usecases/student.usecase");

// Create a new student
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { selectedCampusId, userId } = req;
    if (!selectedCampusId) {
      throw createError(400, "Debe seleccionarse un campus");
    }

    const newStudent = await createStudent(req.body, selectedCampusId, userId);
    res.status(201).json({
      success: true,
      data: newStudent,
    });
  } catch (error) {
    console.error("Error al crear el estudiante:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get all students
router.get("/", authMiddleware, async (req, res) => {
  try {
    const students = await getAllStudents();
    res.json({
      success: true,
      data: students,
    });
  } catch (error) {
    console.error("Error al obtener los estudiantes:", error);
    res.status(500).json({
      success: false,
      error: "Error al obtener los estudiantes",
    });
  }
});

// Get a student by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await getStudentById(studentId);
    res.json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error("Error al obtener el estudiante por ID:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get students by campus ID
router.get("/campus/:campusId", authMiddleware, async (req, res) => {
  try {
    const campusId = req.params.campusId;
    const students = await getStudentsByCampusId(campusId);
    res.json({
      success: true,
      data: students,
    });
  } catch (error) {
    console.error("Error al obtener los estudiantes por ID de campus:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

// Update a student by ID
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const studentId = req.params.id;
    const userId = req.userId;
    const updatedStudent = await updateStudent(studentId, req.body, userId); // Pasar userId para seguimiento
    res.json({
      success: true,
      data: updatedStudent,
    });
  } catch (error) {
    console.error("Error al actualizar el estudiante:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;

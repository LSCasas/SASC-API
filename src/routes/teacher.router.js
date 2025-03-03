const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const createError = require("http-errors");
const {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  getTeachersByCampusId,
  updateTeacher,
  deleteTeacher,
} = require("../usecases/teacher.usecase");

// Create a new teacher
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { selectedCampusId, userId } = req;
    if (!selectedCampusId) {
      throw createError(400, "Campus must be selected");
    }

    const newTeacher = await createTeacher(req.body, selectedCampusId, userId);
    res.status(201).json({
      success: true,
      data: newTeacher,
    });
  } catch (error) {
    console.error("Error creating teacher:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get all teachers
router.get("/", authMiddleware, async (req, res) => {
  try {
    const teachers = await getAllTeachers();
    res.json({
      success: true,
      data: teachers,
    });
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching teachers",
    });
  }
});

// Get a teacher by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const teacherId = req.params.id;
    const teacher = await getTeacherById(teacherId);
    res.json({
      success: true,
      data: teacher,
    });
  } catch (error) {
    console.error("Error fetching teacher by ID:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get a teacher by campus ID
router.get("/campus/:campusId", authMiddleware, async (req, res) => {
  try {
    const campusId = req.params.campusId;
    const teachers = await getTeachersByCampusId(campusId);
    res.json({
      success: true,
      data: teachers,
    });
  } catch (error) {
    console.error("Error fetching teachers by campus ID:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

// Update a teacher by ID
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const teacherId = req.params.id;
    const userId = req.userId;
    const { firstName, lastName, phone, email, campusId, isAchive } = req.body;

    const updatedTeacher = await updateTeacher(
      teacherId,
      {
        firstName,
        lastName,
        phone,
        email,
        campusId,
        isAchive,
      },
      userId
    );
    res.json({
      success: true,
      data: updatedTeacher,
    });
  } catch (error) {
    console.error("Error updating teacher:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});
// Delete a teacher by ID
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const teacherId = req.params.id;
    await deleteTeacher(teacherId);
    res.json({
      success: true,
      message: "Teacher deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting teacher:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;

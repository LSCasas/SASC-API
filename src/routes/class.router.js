const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
} = require("../usecases/class.usecase");

// Create a new class
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, schedule, teacherId, campusId, generation } = req.body;
    const newClass = await createClass({
      name,
      schedule,
      teacherId,
      campusId,
      generation,
    });
    res.status(201).json({
      success: true,
      data: newClass,
    });
  } catch (error) {
    console.error("Error creating class:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get all classes
router.get("/", authMiddleware, async (req, res) => {
  try {
    const classes = await getAllClasses();
    res.json({
      success: true,
      data: classes,
    });
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching classes",
    });
  }
});

// Get a class by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const classId = req.params.id;
    const classData = await getClassById(classId);
    res.json({
      success: true,
      data: classData,
    });
  } catch (error) {
    console.error("Error fetching class by ID:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

// Update a class by ID
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const classId = req.params.id;
    const { name, schedule, teacherId, campusId, generation } = req.body;
    const updatedClass = await updateClass(classId, {
      name,
      schedule,
      teacherId,
      campusId,
      generation,
    });
    res.json({
      success: true,
      data: updatedClass,
    });
  } catch (error) {
    console.error("Error updating class:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

// Delete a class by ID
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const classId = req.params.id;
    await deleteClass(classId);
    res.json({
      success: true,
      message: "Class deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting class:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;

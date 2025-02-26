const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  createTutor,
  getAllTutors,
  getTutorById,
  getTutorsByCampusId,
  updateTutor,
  deleteTutor,
} = require("../usecases/tutor.usecase");

// Create a new tutor
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, lastname, curp, phone, campusId, children } = req.body;
    const newTutor = await createTutor({
      name,
      lastname,
      curp,
      phone,
      campusId,
      children, // Campo opcional
    });
    res.status(201).json({
      success: true,
      data: newTutor,
    });
  } catch (error) {
    console.error("Error creating tutor:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get all tutors
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tutors = await getAllTutors();
    res.json({
      success: true,
      data: tutors,
    });
  } catch (error) {
    console.error("Error fetching tutors:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching tutors",
    });
  }
});

// Get a tutor by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const tutorId = req.params.id;
    const tutor = await getTutorById(tutorId);
    res.json({
      success: true,
      data: tutor,
    });
  } catch (error) {
    console.error("Error fetching tutor by ID:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get tutors by campus ID
router.get("/campus/:campusId", authMiddleware, async (req, res) => {
  try {
    const campusId = req.params.campusId;
    const tutors = await getTutorsByCampusId(campusId);
    res.json({
      success: true,
      data: tutors,
    });
  } catch (error) {
    console.error("Error fetching tutors by campus ID:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

// Update a tutor by ID
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const tutorId = req.params.id;
    const { name, lastname, curp, phone, campusId } = req.body;
    const updatedTutor = await updateTutor(tutorId, {
      name,
      lastname,
      curp,
      phone,
      campusId,
    });
    res.json({
      success: true,
      data: updatedTutor,
    });
  } catch (error) {
    console.error("Error updating tutor:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

// Delete a tutor by ID
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const tutorId = req.params.id;
    await deleteTutor(tutorId);
    res.json({
      success: true,
      message: "Tutor deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting tutor:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  createTutor,
  getAllTutors,
  getTutorById,
  getTutorsByCampusId,
  updateTutor,
} = require("../usecases/tutor.usecase");

// Create a new tutor
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, lastname, phone, campusId, children } = req.body;
    const newTutor = await createTutor({
      name,
      lastname,
      phone,
      campusId,
      children,
    });
    res.status(201).json({ success: true, data: newTutor });
  } catch (error) {
    console.error("Error creating tutor:", error);
    res
      .status(error.status || 500)
      .json({ success: false, error: error.message });
  }
});

// Get all tutors
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tutors = await getAllTutors();
    res.json({ success: true, data: tutors });
  } catch (error) {
    console.error("Error fetching tutors:", error);
    res.status(500).json({ success: false, error: "Error fetching tutors" });
  }
});

// Get a tutor by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const tutor = await getTutorById(req.params.id);
    res.json({ success: true, data: tutor });
  } catch (error) {
    console.error("Error fetching tutor by ID:", error);
    res
      .status(error.status || 500)
      .json({ success: false, error: error.message });
  }
});

// Get tutors by campus ID
router.get("/campus/:campusId", authMiddleware, async (req, res) => {
  try {
    const tutors = await getTutorsByCampusId(req.params.campusId);
    res.json({ success: true, data: tutors });
  } catch (error) {
    console.error("Error fetching tutors by campus ID:", error);
    res
      .status(error.status || 500)
      .json({ success: false, error: error.message });
  }
});

// Update a tutor by ID
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const { name, lastname, phone, campusId } = req.body;
    const updatedTutor = await updateTutor(req.params.id, {
      name,
      lastname,
      phone,
      campusId,
    });
    res.json({ success: true, data: updatedTutor });
  } catch (error) {
    console.error("Error updating tutor:", error);
    res
      .status(error.status || 500)
      .json({ success: false, error: error.message });
  }
});

module.exports = router;

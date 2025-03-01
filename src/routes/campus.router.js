const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  createCampus,
  getAllCampuses,
  getCampusById,
  updateCampus,
  deleteCampus,
} = require("../usecases/campus.usecase");

// Create a new campus
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, address, contactPhone } = req.body;
    const userId = req.userId;
    const newCampus = await createCampus(
      { name, address, contactPhone },
      userId
    );
    res.status(201).json({
      success: true,
      data: newCampus,
    });
  } catch (error) {
    console.error("Error creating campus:", error);
    res.status(500).json({
      success: false,
      error: "Error creating campus",
    });
  }
});

// Get all campuses
router.get("/", authMiddleware, async (req, res) => {
  try {
    const campuses = await getAllCampuses();
    res.json({
      success: true,
      data: campuses,
    });
  } catch (error) {
    console.error("Error fetching campuses:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching campuses",
    });
  }
});

// Get a campus by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const campusId = req.params.id;
    const campus = await getCampusById(campusId);
    res.json({
      success: true,
      data: campus,
    });
  } catch (error) {
    console.error("Error fetching campus by ID:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

// Update a campus by ID
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const campusId = req.params.id;
    const { name, address, contactPhone, isAchive } = req.body; // Agregar isAchive
    const userId = req.userId;

    const updatedCampus = await updateCampus(
      campusId,
      { name, address, contactPhone, isAchive }, // Incluir isAchive
      userId
    );

    res.json({
      success: true,
      data: updatedCampus,
    });
  } catch (error) {
    console.error("Error updating campus:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

// Delete a campus by ID
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const campusId = req.params.id;
    await deleteCampus(campusId);
    res.json({
      success: true,
      message: "Campus deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting campus:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;

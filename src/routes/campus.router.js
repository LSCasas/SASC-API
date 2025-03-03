const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  createCampus,
  getAllCampuses,
  getCampusById,
  updateCampus,
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
    console.error("Error al crear el campus:", error);
    res.status(500).json({
      success: false,
      error: "Error al crear el campus",
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
    console.error("Error al obtener los campus:", error);
    res.status(500).json({
      success: false,
      error: "Error al obtener los campus",
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
    console.error("Error al obtener el campus por ID:", error);
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
    const { name, address, contactPhone, isAchive } = req.body;
    const userId = req.userId;

    const updatedCampus = await updateCampus(
      campusId,
      { name, address, contactPhone, isAchive },
      userId
    );

    res.json({
      success: true,
      data: updatedCampus,
    });
  } catch (error) {
    console.error("Error al actualizar el campus:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;

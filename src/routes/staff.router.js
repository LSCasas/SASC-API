const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const createError = require("http-errors");
const {
  createStaff,
  getAllStaffs,
  getStaffById,
  getStaffsByCampusId,
  updateStaff,
} = require("../usecases/staff.usecase");

// Create a new staff
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { selectedCampusId, userId } = req;
    if (!selectedCampusId) {
      throw createError(400, "Debe seleccionar un campus");
    }

    const newStaff = await createStaff(req.body, selectedCampusId, userId);
    res.status(201).json({
      success: true,
      data: newStaff,
    });
  } catch (error) {
    console.error("Error al crear el profesor:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get all staffs
router.get("/", authMiddleware, async (req, res) => {
  try {
    const staffs = await getAllStaffs();
    res.json({
      success: true,
      data: staffs,
    });
  } catch (error) {
    console.error("Error al obtener los profesores:", error);
    res.status(500).json({
      success: false,
      error: "Error al obtener los profesores",
    });
  }
});

// Get a staff by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const staffId = req.params.id;
    const staff = await getStaffById(staffId);
    res.json({
      success: true,
      data: staff,
    });
  } catch (error) {
    console.error("Error al obtener el profesor por ID:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get a staff by campus ID
router.get("/campus/:campusId", authMiddleware, async (req, res) => {
  try {
    const campusId = req.params.campusId;
    const staffs = await getStaffsByCampusId(campusId);
    res.json({
      success: true,
      data: staffs,
    });
  } catch (error) {
    console.error("Error al obtener los profesores por ID de campus:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

// Update a staff by ID
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const staffId = req.params.id;
    const userId = req.userId;
    const { firstName, lastName, phone, email, campusId, isAchive } = req.body;

    const updatedStaff = await updateStaff(
      staffId,
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
      data: updatedStaff,
    });
  } catch (error) {
    console.error("Error al actualizar el profesor:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;

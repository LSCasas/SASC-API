const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const createError = require("http-errors");
const {
  createSheet,
  getAllSheets,
  getSheetById,
  updateSheet,
} = require("../usecases/sheet.usecase");

// Create a new sheet
router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const newSheet = await createSheet(req.body, userId);
    res.status(201).json({
      success: true,
      data: newSheet,
    });
  } catch (error) {
    console.error("Error creating sheet:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get all sheets
router.get("/", authMiddleware, async (req, res) => {
  try {
    const sheets = await getAllSheets();
    res.json({
      success: true,
      data: sheets,
    });
  } catch (error) {
    console.error("Error fetching sheets:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching sheets",
    });
  }
});

// Get a sheet by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const sheetId = req.params.id;
    const sheet = await getSheetById(sheetId);
    res.json({
      success: true,
      data: sheet,
    });
  } catch (error) {
    console.error("Error fetching sheet by ID:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

// Update a sheet by ID
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const sheetId = req.params.id;
    const userId = req.userId;
    const updatedSheet = await updateSheet(sheetId, req.body, userId);
    res.json({
      success: true,
      data: updatedSheet,
    });
  } catch (error) {
    console.error("Error updating sheet:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;

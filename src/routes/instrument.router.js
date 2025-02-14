const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  createInstrument,
  getAllInstruments,
  getInstrumentById,
  updateInstrument,
  deleteInstrument,
} = require("../usecases/instrument.usecase");

// Create a new instrument
router.post("/", authMiddleware, async (req, res) => {
  try {
    const newInstrument = await createInstrument(req.body);
    res.status(201).json({
      success: true,
      data: newInstrument,
    });
  } catch (error) {
    console.error("Error creating instrument:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get all instruments
router.get("/", authMiddleware, async (req, res) => {
  try {
    const instruments = await getAllInstruments();
    res.json({
      success: true,
      data: instruments,
    });
  } catch (error) {
    console.error("Error fetching instruments:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching instruments",
    });
  }
});

// Get an instrument by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const instrumentId = req.params.id;
    const instrument = await getInstrumentById(instrumentId);
    res.json({
      success: true,
      data: instrument,
    });
  } catch (error) {
    console.error("Error fetching instrument by ID:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

// Update an instrument by ID
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const instrumentId = req.params.id;
    const updatedInstrument = await updateInstrument(instrumentId, req.body);
    res.json({
      success: true,
      data: updatedInstrument,
    });
  } catch (error) {
    console.error("Error updating instrument:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

// Delete an instrument by ID
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const instrumentId = req.params.id;
    await deleteInstrument(instrumentId);
    res.json({
      success: true,
      message: "Instrument deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting instrument:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;

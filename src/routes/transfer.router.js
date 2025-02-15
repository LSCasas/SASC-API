const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  createTransfer,
  getAllTransfers,
  getTransferById,
  getTransfersByCampusId,
  updateTransfer,
  deleteTransfer,
} = require("../usecases/transfer.usecase");

// Create a new transfer
router.post("/", authMiddleware, async (req, res) => {
  try {
    const newTransfer = await createTransfer(req.body);
    res.status(201).json({
      success: true,
      data: newTransfer,
    });
  } catch (error) {
    console.error("Error creating transfer:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get all transfers
router.get("/", authMiddleware, async (req, res) => {
  try {
    const transfers = await getAllTransfers();
    res.json({
      success: true,
      data: transfers,
    });
  } catch (error) {
    console.error("Error fetching transfers:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching transfers",
    });
  }
});

// Get a transfer by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const transferId = req.params.id;
    const transfer = await getTransferById(transferId);
    res.json({
      success: true,
      data: transfer,
    });
  } catch (error) {
    console.error("Error fetching transfer by ID:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get a transfer by campus ID
router.get("/campus/:campusId", authMiddleware, async (req, res) => {
  try {
    const campusId = req.params.campusId;
    const transfers = await getTransfersByCampusId(campusId);
    res.json({
      success: true,
      data: transfers,
    });
  } catch (error) {
    console.error("Error fetching transfers by campus ID:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

// Update a transfer by ID
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const transferId = req.params.id;
    const updatedTransfer = await updateTransfer(transferId, req.body);
    res.json({
      success: true,
      data: updatedTransfer,
    });
  } catch (error) {
    console.error("Error updating transfer:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

// Delete a transfer by ID
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const transferId = req.params.id;
    await deleteTransfer(transferId);
    res.json({
      success: true,
      message: "Transfer deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting transfer:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;

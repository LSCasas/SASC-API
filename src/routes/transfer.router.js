const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  createTransfer,
  getAllTransfers,
  getTransferById,
  getTransfersByCampusId,
  updateTransfer,
} = require("../usecases/transfer.usecase");

// Create a new transfer
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { userId } = req;
    const newTransfer = await createTransfer(req.body, userId);
    res.status(201).json({
      success: true,
      data: newTransfer,
    });
  } catch (error) {
    console.error("Error al crear la transferencia:", error);
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
    console.error("Error al obtener las transferencias:", error);
    res.status(500).json({
      success: false,
      error: "Error al obtener las transferencias",
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
    console.error("Error al obtener la transferencia por ID:", error);
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
    console.error("Error al obtener transferencias por ID del campus:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

// Update a transfer by ID
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const { userId } = req;
    const transferId = req.params.id;
    const updatedTransfer = await updateTransfer(transferId, req.body, userId); // Pasar userId a updateTransfer
    res.json({
      success: true,
      data: updatedTransfer,
    });
  } catch (error) {
    console.error("Error al actualizar la transferencia:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;

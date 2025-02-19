const express = require("express");
const authUseCase = require("../usecases/auth.usecase");
const authMiddleware = require("../middleware/auth.middleware");
const router = express.Router();

// Ruta para iniciar sesión
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, campuses } = await authUseCase.login(email, password);

    res.json({
      success: true,
      data: { token, campuses },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
});

// Ruta para seleccionar un campus y actualizar el token
router.post("/select-campus", authMiddleware, async (req, res) => {
  try {
    const { selectedCampusId } = req.body;
    const userId = req.userId;

    const { token } = await authUseCase.updateCampusToken(
      userId,
      selectedCampusId
    );

    res.json({
      success: true,
      data: { token },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;

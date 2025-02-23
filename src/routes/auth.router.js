const express = require("express");
const authUseCase = require("../usecases/auth.usecase");
const userUseCase = require("../usecases/user.usecase"); // Agregar esta línea
const authMiddleware = require("../middleware/auth.middleware");
const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, campuses } = await authUseCase.login(email, password);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 3600 * 1000,
    });

    res.json({
      success: true,
      data: { campuses },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
});

router.post("/select-campus", authMiddleware, async (req, res) => {
  try {
    const { selectedCampusId } = req.body;
    const userId = req.userId;

    if (!selectedCampusId) {
      return res.status(400).json({
        success: false,
        message: "El ID del campus es requerido",
      });
    }

    const user = await userUseCase.getUserById(userId); // Aquí se usa userUseCase
    user.selectedCampusId = selectedCampusId;
    await user.save();

    const { token } = await authUseCase.updateCampusToken(
      userId,
      selectedCampusId
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 3600 * 1000,
    });

    return res.json({
      success: true,
      message: "Campus seleccionado y actualizado exitosamente",
    });
  } catch (error) {
    console.error("Error en select-campus:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor en select-campus",
    });
  }
});

module.exports = router;

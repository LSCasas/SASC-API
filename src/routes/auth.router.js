const express = require("express");
const authUseCase = require("../usecases/auth.usecase");
const userUseCase = require("../usecases/user.usecase");
const authMiddleware = require("../middleware/auth.middleware");
const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, campuses } = await authUseCase.login(email, password);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
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

    const user = await userUseCase.getUserById(userId);
    if (user.isArchived) {
      return res.status(403).json({
        success: false,
        message:
          "No puedes seleccionar un campus porque tu cuenta ha sido desactivada.",
      });
    }

    user.selectedCampusId = selectedCampusId;
    await user.save();

    const { token } = await authUseCase.updateCampusToken(
      userId,
      selectedCampusId
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
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

router.post("/logout", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    const user = await userUseCase.getUserById(userId);
    user.selectedCampusId = null;
    await user.save();

    res.cookie("token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.json({
      success: true,
      message: "Sesión cerrada correctamente y campus desasignado",
    });
  } catch (error) {
    console.error("Error en logout:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor en logout",
    });
  }
});

module.exports = router;

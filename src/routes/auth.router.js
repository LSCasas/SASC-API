const express = require("express");
const authUseCase = require("../usecases/auth.usecase");
const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await authUseCase.login(email, password);
    res.json({
      success: true,
      data: { token },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;

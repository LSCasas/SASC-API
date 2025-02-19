const createError = require("http-errors");
const userUseCase = require("../usecases/user.usecase");
const jwt = require("../lib/jwt");

async function auth(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw createError(401, "JWT is required");
    }

    // Verificar el token
    const payload = jwt.verify(token);
    req.userId = payload.id;
    req.campusId = payload.campusId; // Lista de campus
    req.selectedCampusId = payload.selectedCampusId || null; // Sede seleccionada

    const user = await userUseCase.getUserById(req.userId);
    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error.message,
    });
  }
}

module.exports = auth;

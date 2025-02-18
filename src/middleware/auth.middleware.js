const createError = require("http-errors");
const userUseCase = require("../usecases/user.usecase");
const jwt = require("../lib/jwt");

async function auth(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Obtener el token en formato "Bearer <token>"
    if (!token) {
      throw createError(401, "JWT is required");
    }

    // Verificar el token y obtener el payload
    const payload = jwt.verify(token);
    req.userId = payload.id; // Guardamos el userId extraído del token en req.userId

    const user = await userUseCase.getUserById(req.userId); // Usamos el userId para obtener el usuario

    req.user = user; // Guardamos el usuario completo en req.user (si lo necesitas en otras partes del código)

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error.message,
    });
  }
}

module.exports = auth;

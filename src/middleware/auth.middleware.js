const createError = require("http-errors");
const userUseCase = require("../usecases/user.usecase");
const jwt = require("../lib/jwt");

async function auth(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      throw createError(401, "JWT is required");
    }

    const payload = jwt.verify(token);
    req.userId = payload.id;
    req.campusId = payload.campusId;
    req.selectedCampusId = payload.selectedCampusId || null;

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

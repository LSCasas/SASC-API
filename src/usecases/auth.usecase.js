const createError = require("http-errors");
const User = require("../models/user.model");
const jwt = require("../lib/jwt");
const bcrypt = require("../lib/encrypt");

async function login(email, password) {
  const user = await User.findOne({ email }).populate("campusId");
  if (!user) {
    throw new Error("Correo o contraseña inválida");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Correo o contraseña inválida");
  }

  const token = jwt.sign({ id: user._id, email: user.email });

  return {
    token,
    campuses: user.campusId, // Devolver las sedes asociadas
  };
}

module.exports = { login };

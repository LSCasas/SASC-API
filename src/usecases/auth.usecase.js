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

  // Crear el token inicial SIN un campus seleccionado
  const token = jwt.sign({
    id: user._id,
    email: user.email,
    campusId: user.campusId.map((campus) => campus._id), // Lista de campus
  });

  return {
    token,
    campuses: user.campusId, // Lista de sedes disponibles
  };
}

// Función para actualizar el token con la sede seleccionada
async function updateCampusToken(userId, selectedCampusId) {
  const user = await User.findById(userId).populate("campusId");
  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  if (
    !user.campusId.some((campus) => campus._id.toString() === selectedCampusId)
  ) {
    throw new Error("El usuario no tiene acceso a esta sede");
  }

  const token = jwt.sign({
    id: user._id,
    email: user.email,
    campusId: user.campusId.map((campus) => campus._id), // Lista de campus
    selectedCampusId, // Guardamos el campus seleccionado
  });

  return { token };
}

module.exports = { login, updateCampusToken };

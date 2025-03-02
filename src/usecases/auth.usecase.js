const createError = require("http-errors");
const User = require("../models/user.model");
const jwt = require("../lib/jwt");
const bcrypt = require("../lib/encrypt");

async function login(email, password) {
  const user = await User.findOne({ email }).populate("campusId");
  if (!user) {
    throw new Error("Correo o contraseña inválida");
  }

  if (user.isArchived) {
    throw new Error(
      "Tu cuenta ha sido desactivada. Contacta con el administrador para más información."
    );
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Correo o contraseña inválida");
  }

  const token = jwt.sign({
    id: user._id,
    email: user.email,
    campusId: user.campusId.map((campus) => campus._id),
  });

  return {
    token,
    campuses: user.campusId,
  };
}

async function updateCampusToken(userId, selectedCampusId) {
  const user = await User.findById(userId).populate("campusId");
  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  if (user.isArchived) {
    throw new Error(
      "Tu cuenta ha sido desactivada. Contacta con el administrador para más información."
    );
  }

  if (
    !user.campusId.some((campus) => campus._id.toString() === selectedCampusId)
  ) {
    throw new Error("El usuario no tiene acceso a esta sede");
  }

  user.selectedCampusId = selectedCampusId;
  await user.save();

  const token = jwt.sign({
    id: user._id,
    email: user.email,
    campusId: user.campusId.map((campus) => campus._id),
    selectedCampusId,
  });

  return { token };
}

module.exports = { login, updateCampusToken };

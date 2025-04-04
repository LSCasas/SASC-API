const mongoose = require("mongoose");
const User = require("../models/user.model");
const Campus = require("../models/campus.model");
const createError = require("http-errors");
const encrypt = require("../lib/encrypt");

// Create a user
const createUser = async ({
  firstName,
  lastName,
  email,
  password,
  phone,
  role,
  campusId = [],
  createdBy,
  adminType,
}) => {
  try {
    const userFound = await User.findOne({ email });
    if (userFound) {
      throw createError(409, "Correo electrónico ya en uso");
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw createError(400, "Formato de correo electrónico no válido");
    }

    if (!password) {
      throw createError(400, "Se requiere contraseña");
    }

    password = await encrypt.encrypt(password);

    const newUserData = {
      firstName,
      lastName,
      email,
      password,
      phone,
      role,
      campusId: [],
      createdBy,
      adminType: adminType || null,
    };

    if (role === "admin") {
      const campuses = await Campus.find();
      newUserData.campusId = campuses.map((campus) => campus._id);
    } else if (Array.isArray(campusId) && campusId.length > 0) {
      newUserData.campusId = campusId.map(
        (id) => new mongoose.Types.ObjectId(id)
      );
    }

    const newUser = new User(newUserData);
    await newUser.save();
    return newUser;
  } catch (error) {
    console.error("Error al crear usuario:", error);
    throw createError(500, "Error al crear usuario: " + error.message);
  }
};

// Get user auth
const getCurrentUser = async (userId) => {
  try {
    const user = await User.findById(userId).populate("campusId");
    if (!user) throw createError(404, "Usuario no encontrado");
    return user;
  } catch (error) {
    throw createError(500, "Error al obtener el usuario: " + error.message);
  }
};

//Get campuses by coordinator
const getCampusesByCoordinator = async (userId) => {
  try {
    const user = await User.findById(userId).populate("campusId");
    if (!user) throw createError(404, "Usuario no encontrado");
    return user.campusId;
  } catch (error) {
    throw createError(500, "Error al obtener los campus: " + error.message);
  }
};

// Get all users
const getAllUsers = async () => {
  try {
    return await User.find().populate("campusId");
  } catch (error) {
    throw createError(500, "Error al obtener los usuarios: " + error.message);
  }
};

// Get a user by ID
const getUserById = async (id) => {
  try {
    const user = await User.findById(id).populate("campusId");
    if (!user) throw createError(404, "Usuario no encontrado");
    return user;
  } catch (error) {
    throw createError(500, "Error al obtener el usuario: " + error.message);
  }
};

// Update a user by ID
const updateUser = async (id, updateData, updatedBy) => {
  try {
    if (updateData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updateData.email)) {
        throw new Error("El formato del email no es válido.");
      }

      const emailExists = await User.findOne({
        email: updateData.email,
        _id: { $ne: id },
      });
      if (emailExists) {
        throw createError(409, "Correo electrónico ya en uso por otro usuario");
      }
    }

    const user = await User.findById(id);
    if (!user) throw createError(404, "Usuario no encontrado");

    if (user.role === "admin" && updateData.role === "coordinator") {
      updateData.adminType = null;
    }

    if (updateData.role === "admin") {
      const campuses = await Campus.find();
      updateData.campusId = campuses.map((campus) => campus._id);
    }

    if (updateData.isArchived === true) {
      updateData.campusId = [];
    }

    if (updateData.campusId) {
      if (!Array.isArray(updateData.campusId)) {
        throw createError(400, "campusId debe ser una matriz");
      }

      let currentCampuses = user.campusId.map((campus) => campus.toString());
      let newCampuses = updateData.campusId.map((id) => id.toString());

      if (newCampuses.length === 0) {
        updateData.campusId = [];
      } else {
        const campusesToRemove = newCampuses
          .filter((id) => id.startsWith("-"))
          .map((id) => id.substring(1));

        currentCampuses = currentCampuses.filter(
          (campus) => !campusesToRemove.includes(campus)
        );

        const campusesToAdd = newCampuses.filter((id) => !id.startsWith("-"));
        updateData.campusId = [
          ...new Set([...currentCampuses, ...campusesToAdd]),
        ];
      }
    }

    if (updateData.password) {
      updateData.password = await encrypt.encrypt(updateData.password);
    }

    updateData.updatedBy = updatedBy;
    updateData.updatedAt = new Date();

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) throw createError(404, "Usuario no encontrado");
    return updatedUser;
  } catch (error) {
    throw createError(500, "Error al actualizar usuario:" + error.message);
  }
};

module.exports = {
  createUser,
  getCurrentUser,
  getAllUsers,
  getUserById,
  updateUser,
  getCampusesByCoordinator,
};

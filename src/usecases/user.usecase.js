const User = require("../models/user.model");
const Campus = require("../models/campus.model"); // Asegúrate de tener el modelo de Campus
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
}) => {
  try {
    const userFound = await User.findOne({ email });
    if (userFound) {
      throw createError(409, "Email already in use");
    }

    if (!password) {
      throw createError(400, "Password is required");
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
    console.error("Error creating user:", error);
    throw createError(500, "Error creating user: " + error.message);
  }
};

//Get campuses by coordinator
const getCampusesByCoordinator = async (userId) => {
  try {
    const user = await User.findById(userId).populate("campusId");
    if (!user) throw createError(404, "User not found");
    return user.campusId;
  } catch (error) {
    throw createError(500, "Error fetching campuses: " + error.message);
  }
};

// Get all users
const getAllUsers = async () => {
  try {
    return await User.find().populate("campusId");
  } catch (error) {
    throw createError(500, "Error fetching users: " + error.message);
  }
};

// Get a user by ID
const getUserById = async (id) => {
  try {
    const user = await User.findById(id).populate("campusId");
    if (!user) throw createError(404, "User not found");
    return user;
  } catch (error) {
    throw createError(500, "Error fetching user: " + error.message);
  }
};

// Update a user by ID
const updateUser = async (id, updateData) => {
  try {
    if (updateData.password) {
      updateData.password = await encrypt.encrypt(updateData.password);
    }

    // Obtener usuario actual
    const user = await User.findById(id);
    if (!user) throw createError(404, "User not found");

    if (updateData.campusId) {
      if (!Array.isArray(updateData.campusId)) {
        throw createError(400, "campusId must be an array");
      }

      let currentCampuses = user.campusId.map((campus) => campus.toString());
      let newCampuses = updateData.campusId.map((id) => id.toString());

      if (newCampuses.length === 0) {
        // Si el array está vacío, eliminar todas las sedes
        updateData.campusId = [];
      } else {
        // Filtrar campus a eliminar (los que comienzan con "-")
        const campusesToRemove = newCampuses
          .filter((id) => id.startsWith("-"))
          .map((id) => id.substring(1));

        // Mantener solo los campus que no estén en la lista de eliminación
        currentCampuses = currentCampuses.filter(
          (campus) => !campusesToRemove.includes(campus)
        );

        // Agregar los nuevos campus que no sean de eliminación
        const campusesToAdd = newCampuses.filter((id) => !id.startsWith("-"));
        updateData.campusId = [
          ...new Set([...currentCampuses, ...campusesToAdd]),
        ];
      }
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) throw createError(404, "User not found");
    return updatedUser;
  } catch (error) {
    throw createError(500, "Error updating user: " + error.message);
  }
};

// Delete a user by ID
const deleteUser = async (id) => {
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) throw createError(404, "User not found");
    return user;
  } catch (error) {
    throw createError(500, "Error deleting user: " + error.message);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getCampusesByCoordinator,
};

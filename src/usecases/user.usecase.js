const User = require("../models/user.model");
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

    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      role,
    });
    await newUser.save();
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw createError(500, "Error creating user: " + error.message);
  }
};

// Get all users
const getAllUsers = async () => {
  try {
    return await User.find();
  } catch (error) {
    throw createError(500, "Error fetching users: " + error.message);
  }
};

// Get a user by ID
const getUserById = async (id) => {
  try {
    const user = await User.findById(id);
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
};

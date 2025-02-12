const express = require("express");
const router = express.Router();
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../usecases/user.usecase");

// Create a new user
router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, role } = req.body;
    const newUser = await createUser({
      firstName,
      lastName,
      email,
      password,
      phone,
      role,
    });
    res.status(201).json({
      success: true,
      data: newUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      error: "Error creating user",
    });
  }
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching users",
    });
  }
});

// Get a user by ID
router.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await getUserById(userId);
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

// Update a user by ID
router.patch("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { firstName, lastName, email, password, phone, role } = req.body;
    const updatedUser = await updateUser(userId, {
      firstName,
      lastName,
      email,
      password,
      phone,
      role,
    });
    res.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

// Delete a user by ID
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    await deleteUser(userId);
    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getCampusesByCoordinator,
} = require("../usecases/user.usecase");

// Create a new user
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, role, campusId } =
      req.body;
    const newUser = await createUser({
      firstName,
      lastName,
      email,
      password,
      phone,
      role,
      campusId,
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

// Get campus by coordinator
router.get("/my-campuses", authMiddleware, async (req, res) => {
  try {
    const campuses = await getCampusesByCoordinator(req.user.id);
    res.json({ success: true, data: campuses });
  } catch (error) {
    console.error("Error fetching campuses:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get all users
router.get("/", authMiddleware, async (req, res) => {
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
router.get("/:id", authMiddleware, async (req, res) => {
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
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;
    const { firstName, lastName, email, password, phone, role, campusId } =
      req.body;

    const updatedUser = await updateUser(userId, {
      firstName,
      lastName,
      email,
      password,
      phone,
      role,
      campusId,
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
router.delete("/:id", authMiddleware, async (req, res) => {
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

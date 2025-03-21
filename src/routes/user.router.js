const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  createUser,
  getCurrentUser,
  getAllUsers,
  getUserById,
  updateUser,
  getCampusesByCoordinator,
} = require("../usecases/user.usecase");

// Create a new user
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      role,
      campusId,
      adminType,
    } = req.body;
    const createdBy = req.user.id;

    const newUser = await createUser({
      firstName,
      lastName,
      email,
      password,
      phone,
      role,
      campusId,
      adminType,
      createdBy,
    });

    res.status(201).json({
      success: true,
      data: newUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message,
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

// GET user auth
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await getCurrentUser(req.user.id);
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
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
    const updatedUser = await updateUser(req.params.id, req.body, req.user.id);
    res.json({ success: true, data: updatedUser });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ success: false, error: error.message });
  }
});

module.exports = router;

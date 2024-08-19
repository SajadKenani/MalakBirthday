import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  authenticateUser,
  refreshToken,
  checkTokenValidity,
  logoutUser,
} from "../controllers/userController.js";

import { authenticateJWT } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", authenticateJWT, createUser);
router.post("/login", authenticateUser);
router.post("/token", refreshToken);
router.get("/users", authenticateJWT, getAllUsers);
router.get("/users/:id", authenticateJWT, getUserById);
router.put("/users/:id", authenticateJWT, updateUserById);
router.delete("/users/:id", authenticateJWT, deleteUserById);
router.post("/verify", checkTokenValidity);

router.post("/logout", authenticateJWT, logoutUser);

export default router;

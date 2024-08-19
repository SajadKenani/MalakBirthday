import express from "express";
import { upload } from "../middleware/uploadMiddleware.js";
import {
  getSettings,
  updateSettings,
} from "../controllers/settingsController.js";
import {
  authenticateJWT,
  checkAdminPrivileges,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all Settings
router.get("/settings", getSettings);

// Update Settings
router.put(
  "/settings",
  upload.fields([{ name: "site_logo" }, { name: "site_favicon" }]),
  updateSettings,
  authenticateJWT
);

export default router;

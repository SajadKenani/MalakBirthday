// routes/categoryRoutes.js

import express from "express";
import { upload } from "../middleware/uploadMiddleware.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
} from "../controllers/categoryController.js";

const router = express.Router();

// Create a new Category with image upload
router.post(
  "/categories",
  upload.single("img"),
  authenticateJWT,
  createCategory
);

// Get all categories
router.get("/categories", getAllCategories);

// Get Category by ID
router.get("/categories/:id", getCategoryById);

// Update Category by ID with image upload
router.put(
  "/categories/:id",
  upload.single("img"),
  authenticateJWT,
  updateCategoryById
);

// Delete Category by ID
router.delete("/categories/:id", authenticateJWT, deleteCategoryById);

export default router;

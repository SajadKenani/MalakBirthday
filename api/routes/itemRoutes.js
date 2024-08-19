import express from "express";
import { upload } from "../middleware/uploadMiddleware.js";
import {
  createItem,
  getAllItems,
  getItemById,
  updateItemById,
  deleteItemById,
  getItemsByUserId,
  getItemsByCategoryId,
} from "../controllers/itemController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a new Item
router.post("/items", upload.single("img"), authenticateJWT, createItem);

// Get all Items
router.get("/items", getAllItems);

// Get Item by ID
router.get("/items/:id", getItemById);

// Update Item by ID
router.put("/items/:id", upload.single("img"), authenticateJWT, updateItemById);

// Delete Item by ID
router.delete("/items/:id", authenticateJWT, deleteItemById);

router.get("/items/user/:id", getItemsByUserId);

router.get("/items/category/:id", getItemsByCategoryId);

export default router;

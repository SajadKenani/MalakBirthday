import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderById,
  deleteOrderById,
} from "../controllers/orderController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a new Order
router.post("/orders", createOrder);

// Get all Orders
router.get("/orders", getAllOrders);

// Get Order by ID
router.get("/orders/:id", getOrderById);

// Update Order by ID
router.put("/orders/:id", authenticateJWT, updateOrderById);

// Delete Order by ID
router.delete("/orders/:id", deleteOrderById);

export default router;

import dotenv from "dotenv";
dotenv.config();
import db_connect from "./utils/database.js";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import http from "http";
import expressWs from "express-ws";
import path from "path";
import { fileURLToPath } from "url";

// Import routes
import categoryRoutes from "./api/routes/categoryRoutes.js";
import itemRoutes from "./api/routes/itemRoutes.js";
import orderRoutes from "./api/routes/orderRoutes.js";
import userRoutes from "./api/routes/userRoutes.js";
import settingsRoutes from "./api/routes/settingsRoutes.js";

// Initialize Express
const app = express();
const server = http.createServer(app);
expressWs(app, server);
const PORT = 3000;

// Setup necessary utilities for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(bodyParser.json());
app.use(express.json());

// Enable CORS
const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

// Connect to MySQL database
db_connect.connect((err) => {
  if (err) {
    console.log("Error connecting to the database:", err.message);
    return;
  }
  console.log("Database connected:", db_connect.threadId);
});

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Fallback to the default image if the file does not exist
app.get("/uploads/*", (req, res) => {
  res.sendFile(path.join(__dirname, "uploads", "default-icon.png"));
});

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the Restaurant Commerce Shop API");
});

// Use the routes
app.use("/api", categoryRoutes);
app.use("/api", itemRoutes);
app.use("/api", orderRoutes);
app.use("/api", userRoutes);
app.use("/api", settingsRoutes);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  console.log(`404 - Not Found - ${req.method} ${req.url}`);
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Error handler for sending JSON responses
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message,
    error: process.env.NODE_ENV !== "production" ? err : {},
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

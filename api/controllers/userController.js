import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import db_connect from "../../utils/database.js";

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

const cryptoKey = process.env.CRYPTO_SECRET_KEY;

// In-memory storage for session management
const sessions = {};

// Helper function to generate session ID
const generateSessionId = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

// Middleware to verify access token
export const verifyAccessToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid access token" });
    }

    const currentSessionId = sessions[user.id];
    if (!currentSessionId || currentSessionId !== user.sessionId) {
      return res.status(403).json({ message: "Invalid access token" });
    }

    req.user = user;
    next();
  });
};

// Utility function to check authentication validity
export const isAuthenticated = (token) => {
  try {
    if (!token) {
      return false;
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const currentSessionId = sessions[decoded.id];

    if (
      !decoded ||
      !currentSessionId ||
      currentSessionId !== decoded.sessionId
    ) {
      return false;
    }

    return true;
  } catch (err) {
    return false;
  }
};

// Endpoint to check token validity
export const checkTokenValidity = (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  const isValid = isAuthenticated(token);
  return res.status(200).json({ isValid });
};

// Create a new user
export const createUser = [
  verifyAccessToken,
  (req, res) => {
    const { user_name, user_password, user_email, user_role } = req.body;

    if (!user_name || !user_password || !user_email || !user_role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user information found" });
    }

    let userRole = req.user.user_role;

    if (!userRole) {
      db_connect.query(
        "SELECT user_role FROM users WHERE id = ?",
        [req.user.id],
        (err, rows) => {
          if (err) {
            return res.status(500).json({ message: err.message });
          }
          if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
          }
          userRole = rows[0].user_role;

          if (userRole !== "admin") {
            return res
              .status(403)
              .json({ message: "Forbidden: Only admins can create users" });
          }

          const newUser = {
            user_name,
            user_password, // Storing plaintext password
            user_email,
            user_role,
          };

          db_connect.query(
            "INSERT INTO users SET ?",
            newUser,
            (err, result) => {
              if (err) {
                return res.status(500).json({ message: err.message });
              }
              res
                .status(201)
                .json({ message: "New user created", data: result });
            }
          );
        }
      );
    } else {
      if (userRole !== "admin") {
        return res
          .status(403)
          .json({ message: "Forbidden: Only admins can create users" });
      }

      const newUser = {
        user_name,
        user_password, // Storing plaintext password
        user_email,
        user_role,
      };

      db_connect.query("INSERT INTO users SET ?", newUser, (err, result) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }
        res.status(201).json({ message: "New user created", data: result });
      });
    }
  },
];

const encryptPassword = (password) => {
  const key = Buffer.from(cryptoKey, "hex");
  const algorithm = "aes-256-cbc";
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encryptedPassword = cipher.update(password, "utf8", "hex");
  encryptedPassword += cipher.final("hex");
  return `${iv.toString("hex")}:${encryptedPassword}`;
};

// Get all users (protected route)
export const getAllUsers = [
  verifyAccessToken,
  (req, res) => {
    db_connect.query("SELECT * FROM users", (err, data) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      // Encrypt passwords before sending response
      const encryptedData = data.map((user) => ({
        ...user,
        user_password: encryptPassword(user.user_password),
      }));
      res.status(200).json(encryptedData);
    });
  },
];

// Get user by ID (protected route)
export const getUserById = [
  verifyAccessToken,
  (req, res) => {
    db_connect.query(
      "SELECT * FROM users WHERE id = ?",
      [req.params.id],
      (err, data) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }
        const user = data[0];
        // Encrypt password before sending response
        const encryptedUser = {
          ...user,
          user_password: encryptPassword(user.user_password),
        };
        res.status(200).json(encryptedUser);
      }
    );
  },
];

// Update user by ID (protected route)
export const updateUserById = [
  verifyAccessToken,
  (req, res) => {
    const { user_name, user_email, user_role, user_password } = req.body;

    if (!user_name || !user_email || !user_role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (
      req.user.user_role !== "admin" &&
      req.user.id !== parseInt(req.params.id, 10)
    ) {
      return res.status(403).json({
        message: "Forbidden: Only admins can update other users' details",
      });
    }

    if (
      req.user.user_role === "admin" &&
      req.user.id === parseInt(req.params.id, 10)
    ) {
      return res
        .status(403)
        .json({ message: "Forbidden: Admin cannot delete themselves" });
    }

    const updateUser = { user_name, user_email, user_role };

    // If password is provided, add it to the updateUser object
    if (user_password) {
      updateUser.user_password = user_password;
    }

    db_connect.query(
      "UPDATE users SET ? WHERE id = ?",
      [updateUser, req.params.id],
      (err, data) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ message: "User updated", data });
      }
    );
  },
];

// Delete user by ID (protected route)
export const deleteUserById = [
  verifyAccessToken,
  (req, res) => {
    if (
      req.user.user_role !== "admin" &&
      req.user.id === parseInt(req.params.id, 10)
    ) {
      return res
        .status(403)
        .json({ message: "Forbidden: Users cannot delete their own accounts" });
    }

    if (
      req.user.user_role === "admin" &&
      req.user.id === parseInt(req.params.id, 10)
    ) {
      return res
        .status(403)
        .json({ message: "Forbidden: Admin cannot delete themselves" });
    }

    db_connect.query(
      "DELETE FROM users WHERE id = ?",
      [req.params.id],
      (err, data) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ message: "User deleted", data });
      }
    );
  },
];

// Authenticate user
export const authenticateUser = (req, res) => {
  const { user_email, user_password } = req.body;

  db_connect.query(
    "SELECT * FROM users WHERE user_email = ?",
    [user_email],
    (err, data) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      if (data.length === 0) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const user = data[0];

      // Compare plain text passwords
      if (user_password !== user.user_password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const sessionId = generateSessionId();
      sessions[user.id] = sessionId;

      const token = jwt.sign(
        {
          id: user.id,
          email: user.user_email,
          user_role: user.user_role,
          sessionId,
        },
        JWT_SECRET,
        { expiresIn: "15m" }
      );

      const refreshToken = jwt.sign(
        {
          id: user.id,
          email: user.user_email,
          user_role: user.user_role,
          sessionId,
        },
        REFRESH_SECRET,
        { expiresIn: "59m" }
      );

      res
        .status(200)
        .json({ message: "User authenticated", token, refreshToken });
    }
  );
};

// Refresh token endpoint
export const refreshToken = (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(401).json({ message: "Token is required" });
  }

  jwt.verify(token, REFRESH_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }
    const currentSessionId = sessions[user.id];
    if (!currentSessionId || currentSessionId !== user.sessionId) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }
    const newSessionId = generateSessionId();
    sessions[user.id] = newSessionId;

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, sessionId: newSessionId },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.status(200).json({ accessToken });
  });
};

// Logout user
export const logoutUser = (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: "Invalid user session" });
    }

    const userId = req.user.id;

    if (!sessions[userId]) {
      return res.status(404).json({ message: "Session not found" });
    }

    delete sessions[userId]; // Ensure session ID is deleted

    return res.status(200).json({ message: "User logged out" });
  } catch (error) {
    console.error("Error logging out user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

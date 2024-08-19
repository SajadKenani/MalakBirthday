import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to authenticate JWT
export const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = user;
    next();
  });
};

// Middleware to check admin privileges
export const checkAdminPrivileges = (req, res, next) => {
  if (req.user.user_role !== "admin") {
    return res.status(403).json({ message: "Admin privileges required." });
  }
  next();
};

// Middleware to check moderator privileges
export const checkModeratorPrivileges = (req, res, next) => {
  if (req.user.user_role !== "moderator") {
    return res.status(403).json({ message: "Moderator privileges required." });
  }
  next();
};

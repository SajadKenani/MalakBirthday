// controllers/settingsController.js
import path from "path";
import db_connect from "../../utils/database.js";
import { deleteFile } from "../middleware/uploadMiddleware.js";
import { verifyAccessToken } from "./userController.js";

// Get all settings
export const getSettings = (req, res) => {
  db_connect.query("SELECT * FROM settings WHERE id = 1", (err, data) => {
    if (err) {
      return res.status(500).json({
        message: "Error fetching settings",
        error: err.message,
      });
    }
    res.status(200).json(data[0]);
  });
};

// Update settings
export const updateSettings = [
  verifyAccessToken,
  (req, res) => {
    // Ensure the user has admin privileges
    if (req.user.user_role !== "admin") {
      return res.status(403).json({ message: "Admin privileges required." });
    }

    const newLogoImg = req.files?.site_logo
      ? path
          .join("uploads", req.files.site_logo[0].filename)
          .replace(/\\/g, "/")
      : null;

    const newFavicoImg = req.files?.site_favicon
      ? path
          .join("uploads", req.files.site_favicon[0].filename)
          .replace(/\\/g, "/")
      : null;

    db_connect.query("SELECT * FROM settings WHERE id = 1", (err, data) => {
      if (err) {
        return res.status(500).json({
          message: "Error fetching settings for update",
          error: err.message,
        });
      }

      const oldLogo = data.length > 0 ? data[0].site_logo : null;
      const oldFavico = data.length > 0 ? data[0].site_favicon : null;

      const updatedSettings = {
        ...req.body,
        site_logo: newLogoImg || oldLogo,
        site_favicon: newFavicoImg || oldFavico,
      };

      db_connect.query(
        "UPDATE settings SET ? WHERE id = 1",
        updatedSettings,
        (err, result) => {
          if (err) {
            return res.status(500).json({
              message: "Error updating settings",
              error: err.message,
            });
          }

          // Delete old files if new files are uploaded
          if (newLogoImg && oldLogo && oldLogo !== newLogoImg) {
            const oldLogoPath = path.join("uploads", path.basename(oldLogo));
            deleteFile(oldLogoPath);
          }

          if (newFavicoImg && oldFavico && oldFavico !== newFavicoImg) {
            const oldFavicoPath = path.join(
              "uploads",
              path.basename(oldFavico)
            );
            deleteFile(oldFavicoPath);
          }

          res.status(200).json({
            message: "Settings updated successfully",
            data: updatedSettings,
          });
        }
      );
    });
  },
];

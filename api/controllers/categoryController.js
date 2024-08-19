import path from "path";
import db_connect from "../../utils/database.js";
import { deleteFile } from "../middleware/uploadMiddleware.js";

// Create a new Category
export const createCategory = (req, res) => {
  const { en_title, ar_title } = req.body;

  // Normalize image path and handle cross-platform compatibility
  const img_url = req.file
    ? path.join("uploads", req.file.filename).replace(/\\/g, "/")
    : null;

  const newCategory = { en_title, ar_title, img_url };

  // Insert the new category into the database
  db_connect.query("INSERT INTO categories SET ?", newCategory, (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error creating category", error: err.message });
    }
    res.status(201).json({
      message: "New Category created",
      data: { id: data.insertId, ...newCategory },
    });
  });
};

// Get all Categories
export const getAllCategories = (req, res) => {
  db_connect.query("SELECT * FROM categories", (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error fetching categories", error: err.message });
    }
    res.status(200).json(data);
  });
};

// Get Category by ID
export const getCategoryById = (req, res) => {
  db_connect.query(
    "SELECT * FROM categories WHERE id = ?",
    [req.params.id],
    (err, data) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error fetching category", error: err.message });
      }
      if (data.length === 0) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.status(200).json(data[0]);
    }
  );
};

// Update Category by ID
export const updateCategoryById = (req, res) => {
  const { en_title, ar_title } = req.body;

  // Get the new image URL from the request, or use the existing one if no new image is provided
  const newImgUrl = req.file
    ? path.join("uploads", req.file.filename).replace(/\\/g, "/")
    : null;

  db_connect.query(
    "SELECT img_url FROM categories WHERE id = ?",
    [req.params.id],
    (err, data) => {
      if (err) {
        return res.status(500).json({
          message: "Error fetching category for update",
          error: err.message,
        });
      }

      const oldImgUrl = data.length > 0 ? data[0].img_url : null;
      const imgUrl = newImgUrl || oldImgUrl;

      const updatedCategory = { en_title, ar_title, img_url: imgUrl };

      // Perform the update operation
      db_connect.query(
        "UPDATE categories SET ? WHERE id = ?",
        [updatedCategory, req.params.id],
        (err, result) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "Error updating category", error: err.message });
          }
          if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Category not found" });
          }

          // Delete the old image if a new image was uploaded
          if (req.file && oldImgUrl) {
            const oldFilePath = path.join("uploads", path.basename(oldImgUrl));
            deleteFile(oldFilePath);
          }

          res.status(200).json({
            message: "Category updated",
            data: { id: req.params.id, ...updatedCategory },
          });
        }
      );
    }
  );
};

// Delete Category by ID
export const deleteCategoryById = (req, res) => {
  db_connect.query(
    "SELECT img_url FROM categories WHERE id = ?",
    [req.params.id],
    (err, data) => {
      if (err) {
        return res.status(500).json({
          message: "Error fetching category for deletion",
          error: err.message,
        });
      }

      const imgUrl = data.length > 0 ? data[0].img_url : null;

      db_connect.query(
        "DELETE FROM categories WHERE id = ?",
        [req.params.id],
        (err, result) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "Error deleting category", error: err.message });
          }
          if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Category not found" });
          }

          // Delete the associated image file
          if (imgUrl) {
            const filePath = path.join("uploads", path.basename(imgUrl));
            deleteFile(filePath);
          }

          res.status(200).json({ message: "Category deleted" });
        }
      );
    }
  );
};

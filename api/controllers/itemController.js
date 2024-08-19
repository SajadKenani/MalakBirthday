import db_connect from "../../utils/database.js";
import path from "path";
import { upload, deleteFile } from "../middleware/uploadMiddleware.js";

// Create a new Item
export const createItem = (req, res) => {
  const {
    category_id,
    en_item_name,
    ar_item_name,
    en_item_description,
    ar_item_description,
    item_price,
  } = req.body;

  const item_img_url = req.file
    ? path.join("uploads", req.file.filename).replace(/\\/g, "/")
    : null;

  const newItem = {
    category_id,
    en_item_name,
    ar_item_name,
    en_item_description,
    ar_item_description,
    item_price,
    item_img_url,
  };

  db_connect.query("INSERT INTO items SET ?", newItem, (err, data) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
    res.status(201).json({
      message: "New Item created",
      data: { id: data.insertId, ...newItem },
    });
  });
};

// Get all Items
export const getAllItems = (req, res) => {
  db_connect.query("SELECT * FROM items", (err, data) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
    res.status(200).json(data);
  });
};

// Get Item by ID
export const getItemById = (req, res) => {
  db_connect.query(
    "SELECT * FROM items WHERE id = ?",
    req.params.id,
    (err, data) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }
      res.status(200).json(data[0]);
    }
  );
};

// Update Item by ID
export const updateItemById = (req, res) => {
  const {
    category_id,
    en_item_name,
    ar_item_name,
    en_item_description,
    ar_item_description,
    item_price,
  } = req.body;

  // Get the new image URL from the request, or use the existing one if no new image is provided
  const newImgUrl = req.file
    ? path.join("uploads", req.file.filename).replace(/\\/g, "/")
    : null;

  db_connect.query(
    "SELECT item_img_url FROM items WHERE id = ?",
    req.params.id,
    (err, data) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      const oldImgUrl = data.length > 0 ? data[0].item_img_url : null;
      const imgUrl = newImgUrl || oldImgUrl;

      const updatedItem = {
        category_id,
        en_item_name,
        ar_item_name,
        en_item_description,
        ar_item_description,
        item_price,
        item_img_url: imgUrl,
      };

      db_connect.query(
        "UPDATE items SET ? WHERE id = ?",
        [updatedItem, req.params.id],
        (err, result) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "Error updating item", error: err.message });
          }
          if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Item not found" });
          }

          // Delete the old image if a new image was uploaded
          if (req.file && oldImgUrl) {
            const oldFilePath = path.join("uploads", path.basename(oldImgUrl));
            deleteFile(oldFilePath);
          }

          res.status(200).json({
            message: "Item updated",
            data: { id: req.params.id, ...updatedItem },
          });
        }
      );
    }
  );
};

// Delete Item by ID
export const deleteItemById = (req, res) => {
  db_connect.query(
    "SELECT item_img_url FROM items WHERE id = ?",
    req.params.id,
    (err, data) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }
      const oldImagePath = data[0].item_img_url;

      db_connect.query(
        "DELETE FROM items WHERE id = ?",
        req.params.id,
        (err, data) => {
          if (err) {
            return res.status(500).json({
              message: err.message,
            });
          }

          if (oldImagePath) {
            deleteFile(oldImagePath);
          }

          res.status(200).json({
            message: "Item deleted",
          });
        }
      );
    }
  );
};

// Get Items by User ID
export const getItemsByUserId = (req, res) => {
  db_connect.query(
    "SELECT * FROM items WHERE user_id = ?",
    req.params.id,
    (err, data) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }
      res.status(200).json(data);
    }
  );
};

// Get Items by Category ID
export const getItemsByCategoryId = (req, res) => {
  db_connect.query(
    "SELECT * FROM items WHERE category_id = ?",
    req.params.id,
    (err, data) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }
      res.status(200).json(data);
    }
  );
};

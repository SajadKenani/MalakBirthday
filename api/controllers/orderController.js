import db_connect from "../../utils/database.js";

// Create a new Order
export const createOrder = (req, res) => {
  const newOrder = req.body;
  db_connect.query("INSERT INTO orders SET ?", newOrder, (err, result) => {
    if (err) {
      res.status(500).json({
        message: err.message,
      });
      return;
    }

    // Retrieve the inserted order from the database
    const orderId = result.insertId;
    db_connect.query(
      "SELECT * FROM orders WHERE id = ?",
      orderId,
      (err, data) => {
        if (err) {
          res.status(500).json({
            message: "Error retrieving created order",
          });
          return;
        }
        const createdOrder = data[0];
        res.status(201).json(createdOrder);
      }
    );
  });
};

// Get all Orders
export const getAllOrders = (req, res) => {
  db_connect.query("SELECT * FROM orders", (err, data) => {
    if (err) {
      res.status(500).json({
        message: err.message,
      });
      return;
    }
    res.status(200).json(data);
  });
};

// Get Order by ID
export const getOrderById = (req, res) => {
  db_connect.query(
    "SELECT * FROM orders WHERE id = ?",
    req.params.id,
    (err, data) => {
      if (err) {
        res.status(500).json({
          message: err.message,
        });
        return;
      }
      res.status(200).json(data[0]);
    }
  );
};

// Update Order by ID

export const updateOrderById = (req, res) => {
  db_connect.query(
    "UPDATE orders SET ? WHERE id = ?",
    [req.body, req.params.id],
    (err, data) => {
      if (err) {
        res.status(500).json({
          message: err.message,
        });
        return;
      }
      res.status(200).json({
        message: "Order updated",
        data: data,
      });
    }
  );
};

// Delete Order by ID
export const deleteOrderById = (req, res) => {
  db_connect.query(
    "DELETE FROM orders WHERE id = ?",
    req.params.id,
    (err, data) => {
      if (err) {
        res.status(500).json({
          message: err.message,
        });
        return;
      }
      res.status(200).json({
        message: "Order deleted",
      });
    }
  );
};

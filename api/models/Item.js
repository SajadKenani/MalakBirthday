const Booking = {
  id: {
    type: "INT",
    primaryKey: true,
    autoIncrement: true,
  },
  category_id: {
    type: "INT",
    notNull: true,
  },
  item_name: {
    type: "VARCHAR(255)",
    notNull: true,
  },
  item_description: {
    type: "TEXT",
    notNull: true,
  },
  item_img_url: {
    type: "VARCHAR(255)",
    notNull: true,
  },
  item_price: {
    type: "DECIMAL(10,2)",
    notNull: true,
  },
  created_at: {
    type: "TIMESTAMP",
    notNull: true,
    default: "CURRENT_TIMESTAMP",
  },
};

export default Booking;

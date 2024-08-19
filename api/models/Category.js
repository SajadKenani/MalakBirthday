const Ticket = {
  id: {
    type: "INT",
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: "VARCHAR(50)",
    notNull: true,
  },
  img_url: {
    type: "VARCHAR(50)",
    notNull: true,
  },
  created_at: {
    type: "TIMESTAMP",
    notNull: true,
    default: "CURRENT_TIMESTAMP",
  },
};

export default Ticket;

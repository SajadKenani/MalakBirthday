const User = {
  id: {
    type: "INT",
    primaryKey: true,
    autoIncrement: true,
  },
  user_name: {
    type: "VARCHAR(255)",
    notNull: true,
  },
  user_password: {
    type: "VARCHAR(255)",
    notNull: true,
  },
  user_email: {
    type: "VARCHAR(255)",
    notNull: true,
  },
  created_at: {
    type: "TIMESTAMP",
    notNull: true,
    default: "CURRENT_TIMESTAMP",
  },
  updated_at: {
    type: "TIMESTAMP",
    notNull: true,
    default: "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  },
};

export default User;

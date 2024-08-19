import dotenv from "dotenv";
dotenv.config();
import mysql from "mysql2";

// Load environment variables

console.log("DB_HOST:", process.env.DB_HOST);

// Connect with MySQL database
const db_connect = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export default db_connect;

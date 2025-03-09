import { pool } from "../database/db.js";

const testConnection = async () => {
  try {
    const response = await pool.query("SELECT NOW()");
    console.log("Connected properly: ", response.rows[0]);
  } catch (error) {
    console.error("Error connecting de DB: ", error);
  }
};

testConnection();

import { json } from "express";
import { pool } from "../database/db.js";

export const createUser = async (name, email, password) => {
  try {
    const query = `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;`;
    const values = [name, email, password];
    const result = await pool.query(query, values);
    return { message: "User created", newUser: result.rows[0] };
  } catch (error) {
    throw new Error("User not created" + error.message);
  }
};
export const findUserByEmail = async (email) => {
  try {
    const query = `SELECT * FROM users WHERE email = $1;`;
    const values = [email];
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return null; // No se encuentra el usuario
    }
    return result.rows[0];
  } catch (error) {
    throw new Error("Error finding user: " + error.message);
  }
};

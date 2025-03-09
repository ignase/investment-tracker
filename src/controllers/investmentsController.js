import { pool } from "../database/db.js";

export const create = async (req, res) => {
  const { name, symbol, amount, price, currency } = req.body;
  try {
    const query = `INSERT INTO investments (name, symbol, amount, price, currency) VALUES ($1, $2, $3, $4, $5) RETURNING *;`;
    const values = [name, symbol, amount, price, currency];

    const result = await pool.query(query, values);
    const newInvestment = result.rows[0];

    res.status(201).json(newInvestment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Investment not created properly: ", error });
  }
};

export const getAll = async (req, res) => {
  try {
    const query = `SELECT * FROM investments;`;
    const result = await pool.query(query);

    res.status(200).json(result.rows);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error getting the data: ", details: error.message });
  }
};

import { pool } from "../database/db.js";

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

export const update = async (req, res) => {
  const { name, symbol, amount, price, currency } = req.body;
  const { id } = req.params;

  try {
    // Hacer la query para obtener la inversión WHERE id = $1
    const query = `SELECT * FROM investments WHERE id = $1;`;
    const result = await pool.query(query, [id]); // Corrección aquí

    if (result.rows.length === 0) {
      return res.status(404).send("Investment not found");
    }

    const investment = result.rows[0];

    const updateFields = [];
    const updateValues = [];

    // Solo agregamos al arreglo aquellos campos que no sean undefined
    if (name !== undefined) {
      updateFields.push("name = $1");
      updateValues.push(name);
    } else {
      updateFields.push("name = $1");
      updateValues.push(investment.name);
    }

    if (symbol !== undefined) {
      updateFields.push("symbol = $2");
      updateValues.push(symbol);
    } else {
      updateFields.push("symbol = $2");
      updateValues.push(investment.symbol);
    }

    if (amount !== undefined) {
      updateFields.push("amount = $3");
      updateValues.push(amount);
    } else {
      updateFields.push("amount = $3");
      updateValues.push(investment.amount);
    }

    if (price !== undefined) {
      updateFields.push("price = $4");
      updateValues.push(price);
    } else {
      updateFields.push("price = $4");
      updateValues.push(investment.price);
    }

    if (currency !== undefined) {
      updateFields.push("currency = $5");
      updateValues.push(currency);
    } else {
      updateFields.push("currency = $5");
      updateValues.push(investment.currency);
    }

    // Si no hay campos para actualizar, lanzamos un error
    if (updateFields.length === 0) {
      return res.status(400).send("No fields to update");
    }

    // Agregar el id al final de los valores
    updateValues.push(id);

    // Construir la consulta de actualización
    const updateQuery = `
      UPDATE investments
      SET ${updateFields.join(", ")}
      WHERE id = $${updateValues.length}  -- Corrección aquí
      RETURNING *;
    `;

    // Ejecutamos la consulta de actualización
    const updateResult = await pool.query(updateQuery, updateValues);

    // Devolvemos la inversión actualizada
    res.status(200).json(updateResult.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al actualizar la inversión");
  }
};

export const deleteInvestment = async (req, res) => {
  const { id } = req.params;

  try {
    // Eliminar y devolver el registro eliminado
    const query = `DELETE FROM investments WHERE id = $1 RETURNING *;`;
    const result = await pool.query(query, [id]);

    // Si no hay registros eliminados, significa que el ID no existe
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Investment not found" });
    }

    res.status(200).json({
      investmentDeleted: result.rows[0],
      message: "Deleted properly",
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not delete the investment",
      error: error.message,
    });
  }
};

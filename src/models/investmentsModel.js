import { pool } from "../database/db.js";

export const getUserInvestments = async (userId) => {
  const query = `SELECT * FROM investments 
                 JOIN users_investments ON investments.id = users_investments.investment_id 
                 WHERE users_investments.user_id = $1;`;
  const values = [userId];

  const result = await pool.query(query, values);
  return result.rows;
};

export const createInvestment = async (
  userId,
  name,
  symbol,
  amount,
  price,
  currency,
  sale_date
) => {
  try {
    // Primero insertamos la inversión en la tabla investments
    const queryInvestment = `INSERT INTO investments (name, symbol, amount, price, currency) 
                             VALUES ($1, $2, $3, $4, $5) 
                             RETURNING id;`;
    const valuesInvestment = [name, symbol, amount, price, currency];
    const resultInvestment = await pool.query(
      queryInvestment,
      valuesInvestment
    );
    const investmentId = resultInvestment.rows[0].id;

    // Luego insertamos en la tabla users_investments para asociar la inversión con el usuario
    const queryAssociation = `INSERT INTO users_investments (user_id, investment_id, amount, purchase_date, sale_date) 
                              VALUES ($1, $2, $3, NOW(), $4);`;
    const valuesAssociation = [userId, investmentId, amount, sale_date];
    await pool.query(queryAssociation, valuesAssociation);

    return {
      message: "Investment created and associated with the user",
      investmentId,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Error creating investment: " + error.message);
  }
};

export const updateInvestment = async (id, data) => {
  try {
    // Obtener la inversión antes de actualizar
    const { rows } = await pool.query(
      `SELECT * FROM investments WHERE id = $1;`,
      [id]
    );

    if (rows.length === 0) {
      return null; // Indica que no se encontró la inversión
    }
    const investment = rows[0];

    const updateFields = [];
    const updateValues = [];

    // Solo agregamos al arreglo aquellos campos que no sean undefined
    if (data.name !== undefined) {
      updateFields.push("name = $1");
      updateValues.push(data.name);
    } else {
      updateFields.push("name = $1");
      updateValues.push(investment.name);
    }

    if (data.symbol !== undefined) {
      updateFields.push("symbol = $2");
      updateValues.push(data.symbol);
    } else {
      updateFields.push("symbol = $2");
      updateValues.push(investment.symbol);
    }

    if (data.amount !== undefined) {
      updateFields.push("amount = $3");
      updateValues.push(data.amount);
    } else {
      updateFields.push("amount = $3");
      updateValues.push(investment.amount);
    }

    if (data.price !== undefined) {
      updateFields.push("price = $4");
      updateValues.push(data.price);
    } else {
      updateFields.push("price = $4");
      updateValues.push(investment.price);
    }

    if (data.currency !== undefined) {
      updateFields.push("currency = $5");
      updateValues.push(data.currency);
    } else {
      updateFields.push("currency = $5");
      updateValues.push(investment.currency);
    }

    if (updateFields.length === 0) {
      throw new Error("No fields to update");
    }

    updateValues.push(id); // Agregar el id al final de los valores

    const updateQuery = `
      UPDATE investments
      SET ${updateFields.join(", ")}
      WHERE id = $${updateValues.length}
      RETURNING *;
    `;

    const updateResult = await pool.query(updateQuery, updateValues);

    return updateResult.rows[0]; // Retorna la inversión actualizada
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteInvestmentModel = async (id) => {
  // Eliminar y devolver el registro eliminado
  const query = `DELETE FROM investments WHERE id = $1 RETURNING *;`;
  const { rows } = await pool.query(query, [id]);
  // Si no hay registros eliminados, significa que el ID no existe
  if (rows.length === 0) {
    return res.status(404).json({ message: "Investment not found" });
  }
  return rows;
};

import { pool } from "../database/db.js";
import {
  createInvestment,
  getUserInvestments,
  updateInvestment,
  deleteInvestmentModel,
} from "../models/investmentsModel.js";

export const getAll = async (req, res) => {
  try {
    const userId = req.user.id;
    const investments = await getUserInvestments(userId);
    res.status(200).json(investments);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error getting the data: ", details: error.message });
  }
};

export const create = async (req, res) => {
  try {
    const { name, symbol, amount, price, currency, sale_date } = req.body;
    const userId = req.user.id; // Obtén el ID del usuario desde req.user

    if (amount === undefined || amount === null) {
      return res.status(400).json({ error: "Amount is required" });
    }
    // Llamada al modelo para crear la inversión
    const investment = await createInvestment(
      userId,
      name,
      symbol,
      amount,
      price,
      currency,
      sale_date
    );
    res.status(201).json(investment);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error creating investment", details: error.message });
  }
};

export const update = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const userId = req.user.id; // Usuario logueado

  try {
    const updated = await updateInvestment(userId, id, data);

    if (!updated) {
      return res.status(404).json({
        message: "Investment not found or not owned by user",
      });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({
      message: "Error updating investment",
      error: error.message,
    });
  }
};

export const deleteInvestment = async (req, res) => {
  const { id } = req.params;
  try {
    const investment = await deleteInvestmentModel(id);
    res.status(200).json({
      investmentDeleted: investment,
      message: "Deleted properly",
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not delete the investment",
      error: error.message,
    });
  }
};

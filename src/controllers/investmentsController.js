import { pool } from "../database/db.js";
import {
  createInvestment,
  getAllInvestments,
  updateInvestment,
  deleteInvestmentModel,
} from "../models/investmentsModel.js";

export const getAll = async (req, res) => {
  try {
    const investments = await getAllInvestments();
    res.status(200).json(investments);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error getting the data: ", details: error.message });
  }
};

export const create = async (req, res) => {
  const { name, symbol, amount, price, currency } = req.body;
  try {
    const newInvestment = await createInvestment(
      name,
      symbol,
      amount,
      price,
      currency
    );
    res.status(201).json(newInvestment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Investment not created properly: ", error });
  }
};

export const update = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const updated = await updateInvestment(id, data);

    if (!updated) {
      return res.status(404).json({ message: "Investment not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating investment", error: error.message });
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

//TODO:
//IMPLEMENTAR EL LOGIN, REGISTER, LOGOUT Y PROTECTED!!!!
// export const login = async (req, res) => {};
// export const register = async (req, res) => {};
// export const logout = async (req, res) => {};
// export const protectedLink = async (req, res) => {};

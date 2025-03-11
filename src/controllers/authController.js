import { protect, generateToken } from "../validations/auth.js";
import bcrypt from "bcryptjs";
import { createUser, findUserByEmail } from "../models/userModel.js";

//Método para crear un usuario (singup)
export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      res.status(400).json({ message: "Error, user already exists" });
    }
    //Encriptando contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    //Creando usuario en la BD
    const newUser = await createUser(name, email, hashedPassword);
    //Generando el token
    const token = generateToken(newUser.id);
    //Enviando token al cliente
    res.status(201).send({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error during signup" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await findUserByEmail(email);
    if (!existingUser) {
      res.status(400).json({ message: "Error, user not found, signup!" });
    }
    //Comparar contraseñas
    const matchPassw = await bcrypt.compare(password, existingUser.password);
    if (!matchPassw) {
      return res.status(400).send({ message: "Invalid password" });
    }
    //Si las contraseñas son iguales
    const token = generateToken(existingUser.id);
    //Devolver el token al cliente
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error, haciendo login", error: error.message });
  }
};

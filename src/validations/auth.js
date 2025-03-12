import jwt from "jsonwebtoken";
import { findUserById } from "../models/userModel.js";

export const protect = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Obtenemos el token del encabezado

  if (!token) {
    return res.status(401).json({ message: "No web token found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verificamos el token
    req.user = decoded.userId; // Accedemos a userId

    // Ahora buscamos al usuario con el userId del token
    const user = await findUserById(decoded.userId); // Usamos userId para buscar

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // Guardamos todo el objeto user en req.user
    next(); // Si todo está bien, pasamos al siguiente middleware o ruta
  } catch (error) {
    console.error("Error during token verification:", error);
    return res
      .status(401)
      .json({ message: "Invalid token", error: error.message });
  }
};

// Creación del Token recibiendo el userId y que expire en 1 hora
//FIXME: //FIXME://FIXME: //FIXME://FIXME: //FIXME://FIXME: //FIXME://FIXME: //FIXME:
/** CAMBIAR LA EXPIRACION DEL TOKEN A 1H CUANDO TERMINE LAS PRUEBAS */
export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "24h" });
};

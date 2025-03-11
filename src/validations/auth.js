import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  //Obtenemos el token del encabezado (header) >>>>>middleware<<<<<
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No web token found" });
  }
  try {
    // Verificamos el token usando la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId; // Guardamos el id del usuario en el req para usarlo más adelante
    next(); // Si todo está bien, pasamos a la siguiente función
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
// Creación del Token recibiendo el userId y que expire en 1 hora
export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

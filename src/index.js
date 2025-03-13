import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getCryptoData } from "./api.js";
import investmentsRoutes from "./routes/investmentsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const PORT = process.env.PORT ?? 4000;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors());

// 🟢 Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, "public")));

// 🟢 Ruta principal para mostrar index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

//Rutas
app.use("/investments", investmentsRoutes);
app.use("/auth", authRoutes);

// app.get("/crypto/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     const cryptoData = await getCryptoData(id); //Llamada a la API de coingecko
//     res.json(cryptoData); //Enviando datos al front
//   } catch (error) {
//     res.status(500).send("Error fetching de data");
//   }
// });

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});

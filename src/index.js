import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getCryptoData } from "./api.js";
import investmentsRoutes from "./routes/investmentsRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const PORT = process.env.PORT ?? 4000;
const app = express();

app.use(express.json());
app.use(cors());

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

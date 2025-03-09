import { create, getAll } from "../controllers/investmentsController.js";
import express from "express";
const router = express.Router();

router.get("/", getAll);
router.post("/", create);

export default router;

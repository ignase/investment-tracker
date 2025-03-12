import {
  create,
  deleteInvestment,
  getAll,
  update,
} from "../controllers/investmentsController.js";
import express from "express";
const router = express.Router();
import { protect } from "../validations/auth.js";

router.get("/", protect, getAll);
router.post("/", protect, create);
router.put("/:id", protect, update);
router.delete("/:id", protect, deleteInvestment);

// router.post("/login", login);
export default router;

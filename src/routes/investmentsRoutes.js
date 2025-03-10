import {
  create,
  deleteInvestment,
  getAll,
  update,
} from "../controllers/investmentsController.js";
import express from "express";
const router = express.Router();

router.get("/", getAll);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", deleteInvestment);

// router.post("/login", login);
export default router;

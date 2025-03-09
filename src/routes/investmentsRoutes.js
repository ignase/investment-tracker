import {
  create,
  getAll,
  update,
} from "../controllers/investmentsController.js";
import express from "express";
const router = express.Router();

router.get("/", getAll);
router.post("/", create);
router.put("/:id", update);

export default router;

import express from "express";
import { BillsController } from "../controllers/bills.ts";

const router = express.Router();

router.get("/", BillsController.read);
router.post("/", BillsController.create);
router.put("/:id", BillsController.update);
router.delete("/:id", BillsController.delete);

export default router;

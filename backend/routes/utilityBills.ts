import express from "express";
import { UtilityBillsController } from "../controllers/utilityBills.ts";

const router = express.Router();

router.get("/", UtilityBillsController.read);
router.post("/", UtilityBillsController.create);
router.put("/:id", UtilityBillsController.update);
router.delete("/:id", UtilityBillsController.delete);

export default router;

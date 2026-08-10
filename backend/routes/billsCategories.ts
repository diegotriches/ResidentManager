import express from "express";
import { BillsCategoriesController } from "../controllers/billsCategories.ts";

const router = express.Router();

router.get("/", BillsCategoriesController.read);
router.post("/", BillsCategoriesController.create);
router.put("/:id", BillsCategoriesController.update);
router.delete("/:id", BillsCategoriesController.delete);

export default router;
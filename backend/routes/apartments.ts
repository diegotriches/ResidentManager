import express from "express";
import { ApartmentsController } from "../controllers/apartments.ts";

const router = express.Router();

router.get("/", ApartmentsController.read);
router.post("/", ApartmentsController.create);
router.put("/:id", ApartmentsController.update);
router.delete("/:id", ApartmentsController.delete);

export default router;
import express from "express";
import { MetersController } from "../controllers/meters.ts";

const router = express.Router();

router.get("/", MetersController.read);
router.get("/report/consumption", MetersController.readConsumption); // GET para filtrar os consumos e passar para medição
router.post("/", MetersController.create);
router.put("/:id", MetersController.update);
router.delete("/:id", MetersController.delete);

export default router;

import express from "express";
import { HomeController } from "../controllers/home.ts"

const router = express.Router();

router.get("/pendingapartments", HomeController.read);

export default router;
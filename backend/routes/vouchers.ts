import express from "express";
import { VouchersController } from "../controllers/vouchers.ts";

const router = express.Router();

router.get("/report/finance", VouchersController.read); // GET - Retorna o relatório financeiro para a tela de Vouchers
router.put('/status', VouchersController.update); // PUT - Rota para salvar/atualizar o status de pagamento

export default router;

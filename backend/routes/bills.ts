import express from "express";
import { initDB } from "../db.ts";

const router = express.Router();

// GET - listas dados
router.get("/", async (req, res) => {
  const db = await initDB();
  const bills = await db.all("SELECT * FROM bills");
  res.json(bills);
});

// POST - criar novo
router.post("/", async (req, res) => {
  try {
    const { bill, totalValue, unitValue } = req.body;
    const db = await initDB();
    const result = await db.run(
      "INSERT INTO bills (bill, totalValue, unitValue) VALUES (?, ?, ?)",
      [bill, totalValue, unitValue],
    );
    res.status(201).json({ meter_id: result.lastID, bill, totalValue, unitValue });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao inserir conta" });
  }
});

// PUT - atualizar
router.put("/:id", async (req, res) => {
  const { bill, totalValue, unitValue } = req.body;
  const { id } = req.params;
  const db = await initDB();

  try {
    const result = await db.run(
      "UPDATE bills SET bill = ?, totalValue = ?, unitValue = ?, updatedAt = CURRENT_TIMESTAMP WHERE bill_id = ?",
      [bill, totalValue, unitValue, id],
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: "Conta não encontrada." });
    }

    res.json({ id, bill, totalValue, unitValue });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar banco de dados." });
  }
});

// DELETE - remover
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const db = await initDB();
    const result = (await db.run("DELETE FROM bills WHERE bill_id = ?", [
      id,
    ])) as { changes: number };

    if (result.changes > 0) {
      res.status(200).json({ message: "Conta removida com sucesso." });
    } else {
      res.status(404).json({
        error: "Conta não encontrada.",
        message: `Não foi possível remover: o ID ${id} não existe`,
      });
    }
  } catch (error) {
    console.error("Erro ao deletar conta:", error);
    res.status(500).json({
      error: "Erro interno do servidor.",
      message: "Ocorreu um erro ao tentar acessaro o banco de dados.",
    });
  }
});

export default router;

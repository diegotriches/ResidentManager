import express from "express";
import { initDB } from "../db.ts";

const router = express.Router();

// GET - listas dados
router.get("/", async (req, res) => {
  const db = await initDB();
  const meters = await db.all("SELECT * FROM meters");
  res.json(meters);
});

// POST - criar novo
router.post("/", async (req, res) => {
  try {
    const { apartment, water, gas } = req.body;
    const db = await initDB();
    const result = await db.run(
      "INSERT INTO meters (apartment, water, gas) VALUES (?, ?, ?)",
      [apartment, water, gas],
    );
    res.status(201).json({ meter_id: result.lastID, apartment, water, gas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao inserir medição" });
  }
});

// PUT - atualizar
router.put("/:id", async (req, res) => {
  const { apartment, water, gas } = req.body;
  const { id } = req.params;
  const db = await initDB();

  try {
    const result = await db.run(
      "UPDATE meters SET apartment = ?, water = ?, gas = ?, updatedAt = CURRENT_TIMESTAMP WHERE meter_id = ?",
      [apartment, water, gas, id],
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: "Medição não encontrada." });
    }

    res.json({ id, apartment, water, gas });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar banco de dados." });
  }
});

// DELETE - remover
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const db = await initDB();
    const result = (await db.run("DELETE FROM meters WHERE meter_id = ?", [
      id,
    ])) as { changes: number };

    if (result.changes > 0) {
      res.status(200).json({ message: "Medição removida com sucesso." });
    } else {
      res.status(404).json({
        error: "Medição não encontrada.",
        message: `Não foi possível remover: o ID ${id} não existe`,
      });
    }
  } catch (error) {
    console.error("Erro ao deletar medição:", error);
    res.status(500).json({
      error: "Erro interno do servidor.",
      message: "Ocorreu um erro ao tentar acessaro o banco de dados.",
    });
  }
});

export default router;

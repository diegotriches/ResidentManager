import express from "express";
import cors from "cors";
import meterRoutes from "./routes/meters.ts";
import { createMetersTable } from "./models/meters.ts";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

await createMetersTable();

app.use("/meters", meterRoutes);

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

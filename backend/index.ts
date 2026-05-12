import express from "express";
import cors from "cors";
import meterRoutes from "./routes/meters.ts";
import billRoutes from "./routes/bills.ts";
import { createMetersTable } from "./models/meters.ts";
import { createBillsTable } from "./models/bills.ts";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

await createMetersTable();
await createBillsTable();

app.use("/meters", meterRoutes);
app.use("/bills", billRoutes);

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

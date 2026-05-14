import express from "express";
import cors from "cors";
import meterRoutes from "./routes/meters.ts";
import billRoutes from "./routes/bills.ts";
import { createMetersTable } from "./models/meters.ts";
import { createBillsTable } from "./models/bills.ts";
import { createUtilityBillsTable } from "./models/utilityBills.ts";
import { createApartmentsTable } from "./models/apartments.ts";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

await createApartmentsTable();
await createMetersTable();
await createBillsTable();
await createUtilityBillsTable();

app.use("/meters", meterRoutes);
app.use("/bills", billRoutes);

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

import express from "express";
import cors from "cors";
import meterRoutes from "./routes/meters.ts";
import billRoutes from "./routes/bills.ts";
import utilityBillsRoutes from "./routes/utilityBills.ts";
import vouchersRoutes from "./routes/vouchers.ts";
import homeRoutes from "./routes/home.ts";
import { createApartmentsTable } from "./models/apartments.ts";
import { createMetersTable } from "./models/meters.ts";
import { createBillsTable } from "./models/bills.ts";
import { createUtilityBillsTable } from "./models/utilityBills.ts";
import { createVouchersTable } from "./models/vouchers.ts";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

await createApartmentsTable();
await createMetersTable();
await createBillsTable();
await createUtilityBillsTable();
await createVouchersTable();

app.use("/meters", meterRoutes);
app.use("/bills", billRoutes);
app.use("/utility-bills", utilityBillsRoutes);
app.use("/vouchers", vouchersRoutes);
app.use("/home", homeRoutes);

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

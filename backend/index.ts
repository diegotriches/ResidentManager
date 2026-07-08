import express from "express";
import cors from "cors";

// Routes
import meterRoutes from "./routes/meters.ts";
import billRoutes from "./routes/bills.ts";
import utilityBillsRoutes from "./routes/utilityBills.ts";
import vouchersRoutes from "./routes/vouchers.ts";
import homeRoutes from "./routes/home.ts";
import apartmentsRoutes from "./routes/apartments.ts"

// Models
import { createVouchersTable } from "./models/vouchers.ts";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Models
await createVouchersTable();

// Routes
app.use("/meters", meterRoutes);
app.use("/bills", billRoutes);
app.use("/utility-bills", utilityBillsRoutes);
app.use("/vouchers", vouchersRoutes);
app.use("/home", homeRoutes);
app.use("/apartments", apartmentsRoutes);

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

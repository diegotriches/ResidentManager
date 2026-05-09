import { Routes, Route } from "react-router-dom";
import { Sidebar } from "./components/layout/Sidebar";
import { Home } from "./pages/Home";
import { MonthlyBills } from "./pages/MonthlyBills";
import { Vouchers } from "./pages/Vouchers";
import { Meters } from "./pages/Meters";
import { Warnings } from "./pages/Warnings";
import { Requests } from "./pages/Requests";
import "./App.css";

function App() {
  return (
    <div className="container">
      <Sidebar />
      <main className="content">
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/monthly-bills" element={<MonthlyBills />} />
            <Route path="/vouchers" element={<Vouchers />} />
            <Route path="/meters" element={<Meters />} />
            <Route path="/warnings" element={<Warnings />} />
            <Route path="/requests" element={<Requests />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;

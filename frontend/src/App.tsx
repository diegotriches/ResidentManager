import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Sidebar } from "./components/layout/Sidebar";
import { Home } from "./pages/Home";
import { Documents } from "./pages/Documents";
import { Vouchers } from "./pages/Vouchers";
import { Meters } from "./pages/Meters";
import { Warnings } from "./pages/Warnings";
import { Requests } from "./pages/Requests";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/vouchers" element={<Vouchers />} />
        <Route path="/meters" element={<Meters />} />
        <Route path="/warnings" element={<Warnings />} />
        <Route path="/requests" element={<Requests />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

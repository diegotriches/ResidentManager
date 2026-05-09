import { NavLink } from "react-router-dom";
import {
  FaBattleNet,
  FaHome,
  FaFileAlt,
  FaMoneyCheckAlt,
  FaTachometerAlt,
  FaUserCog,
  FaInfoCircle,
} from "react-icons/fa";

import "./Sidebar.css";

export const Sidebar = () => {
  return (
    <nav className="sidebar">
      <div className="logo">
        <FaBattleNet className="logo-icon" />
        <h2 className="logo-text">ResidentManager</h2>
      </div>
      <div className="nav-links">
        <NavLink to="/" className="navlink">
          <FaHome className="icon" />
          <span>Home</span>
        </NavLink>
        <NavLink to="/monthly-bills" className="navlink">
          <FaMoneyCheckAlt className="icon" />
          <span>Gastos Mensais</span>
        </NavLink>
        <NavLink to="/vouchers" className="navlink">
          <FaFileAlt className="icon" />
          <span>Comprovantes</span>
        </NavLink>
        <NavLink to="/meters" className="navlink">
          <FaTachometerAlt className="icon" />
          <span>Medidores</span>
        </NavLink>
        <NavLink to="/warnings" className="navlink">
          <FaInfoCircle className="icon" />
          <span>Avisos</span>
        </NavLink>
        <NavLink to="/requests" className="navlink">
          <FaUserCog className="icon" />
          <span>Solicitações</span>
        </NavLink>
      </div>
    </nav>
  );
};

import { useFilter } from "../../context/FilterContext";
import { useTheme } from "../../context/ThemeContext";
import { months } from "../../utils/constants";
import "./FilterBar.css";
import { FaRegSun, FaRegMoon } from "react-icons/fa";

export const FilterBar = () => {
  const { month, setMonth, year, setYear } = useFilter();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="global-filter-container">
      <div className="filter-select">
        <label>Período:</label>
        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          {months.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
          <option value="2027">2027</option>
        </select>
      </div>
      <button
        onClick={toggleTheme}
        className="theme-toggle-btn"
        title="Alternar tema"
      >
        {theme === "light" ? <FaRegMoon /> : <FaRegSun />}
      </button>
    </div>
  );
};

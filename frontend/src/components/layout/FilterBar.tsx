import React from "react";

interface FilterBarProps {
  month: string;
  year: string;
  setMonth: (m: string) => void;
  setYear: (y: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ month, year, setMonth, setYear }) => {
  const months = [
    { val: "01", name: "Janeiro" }, { val: "02", name: "Fevereiro" },
    { val: "03", name: "Março" }, { val: "04", name: "Abril" },
    { val: "05", name: "Maio" }, { val: "06", name: "Junho" },
    { val: "07", name: "Julho" }, { val: "08", name: "Agosto" },
    { val: "09", name: "Setembro" }, { val: "10", name: "Outubro" },
    { val: "11", name: "Novembro" }, { val: "12", name: "Dezembro" }
  ];

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label>Período:</label>
        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          {months.map(m => <option key={m.val} value={m.val}>{m.name}</option>)}
        </select>
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
        </select>
      </div>
    </div>
  );
};
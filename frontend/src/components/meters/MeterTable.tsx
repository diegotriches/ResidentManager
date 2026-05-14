import { useState } from "react";
import type { MeterReportType } from "../../types/meters";

interface MeterTableProps {
  data: MeterReportType[];
  loading: boolean;
}

export const MeterTable: React.FC<MeterTableProps> = ({ data, loading }) => {
  const [unitWaterPrice, setUnitWaterPrice] = useState<number>(0);
  const [unitGasPrice, setUnitGasPrice] = useState<number>(0);
  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  if (loading) return <div className="loading">Carregando consumos...</div>;

  return (
    <div className="records-container">
      <div
        style={{
          display: "flex",
          gap: "20px",
          padding: "1rem",
          background: "#f8f9fa",
          borderBottom: "1px solid #eee",
        }}
      >
        <div>
          <label
            style={{
              fontSize: "0.85rem",
              fontWeight: "bold",
              display: "block",
            }}
          >
            Valor m³ Água:
          </label>
          <input
            type="number"
            value={unitWaterPrice}
            onChange={(e) => setUnitWaterPrice(Number(e.target.value))}
            style={{
              padding: "5px",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
          />
        </div>
        <div>
          <label
            style={{
              fontSize: "0.85rem",
              fontWeight: "bold",
              display: "block",
            }}
          >
            Valor kg Gás:
          </label>
          <input
            type="number"
            value={unitGasPrice}
            onChange={(e) => setUnitGasPrice(Number(e.target.value))}
            style={{
              padding: "5px",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
          />
        </div>
      </div>
      <table className="records-table">
        <thead>
          <tr>
            <th>Apto</th>
            <th>Anterior(m³)</th>
            <th>Atual(m³)</th>
            <th>Consumo Água</th>
            <th>Total Água (R$)</th>
            <th>Anterior(m³)</th>
            <th>Atual(m³)</th>
            <th>Consumo Gás</th>
            <th>Total Gás (R$)</th>
            <th>Total Geral</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => {
            const hasMeasurement = item.water_current !== null;
            const waterTotal = (item.water_consumption || 0) * unitWaterPrice;
            const gasTotal = (item.gas_consumption || 0) * unitGasPrice;
            const grandTotal = waterTotal + gasTotal;

            return (
              <tr
                key={item.apartment}
                className={!hasMeasurement ? "pending-row" : ""}
              >
                <td>
                  <strong>{item.apartment}</strong>
                </td>
                <td>{item.water_previous.toFixed(3)}</td>
                <td>
                  {hasMeasurement ? item.water_current?.toFixed(3) : "---"}
                </td>
                <td className="consumption-value">
                  {hasMeasurement ? item.water_consumption.toFixed(3) : "0.000"}
                </td>
                <td style={{ color: '#27ae60', fontWeight: 'bold' }}>
                  {formatCurrency(waterTotal)}
                </td>
                <td>{item.gas_previous.toFixed(3)}</td>
                <td>{hasMeasurement ? item.gas_current?.toFixed(3) : "---"}</td>
                <td className="consumption-value">
                  {hasMeasurement ? item.gas_consumption.toFixed(3) : "0.000"}
                </td>
                <td style={{ color: '#27ae60', fontWeight: 'bold' }}>
                  {formatCurrency(gasTotal)}
                </td>
                <td>
                  <span
                    className={`badge ${hasMeasurement ? "status-ok" : "status-pending"}`}
                  >
                    {hasMeasurement ? formatCurrency(grandTotal) : "Pendente"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

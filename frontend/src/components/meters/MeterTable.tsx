import type { MeterReportType } from "../../types/meters";

interface MeterTableProps {
  data: MeterReportType[];
  loading: boolean;
}

export const MeterTable: React.FC<MeterTableProps> = ({ data, loading }) => {

  if (loading) return <div className="loading">Carregando consumos...</div>;

  return (
    <div className="records-container">
      <div
        style={{
          display: "flex",
          gap: "20px",
          background: "#f8f9fa",
        }}
      >
      </div>
      <table className="records-table">
        <thead>
          <tr>
            <th>Apto</th>
            <th>Anterior(m³)</th>
            <th>Atual(m³)</th>
            <th>Consumo Água</th>
            <th>Anterior(m³)</th>
            <th>Atual(m³)</th>
            <th>Consumo Gás</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => {
            const hasMeasurement = item.water_current !== null;

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
                <td>{item.gas_previous.toFixed(3)}</td>
                <td>{hasMeasurement ? item.gas_current?.toFixed(3) : "---"}</td>
                <td className="consumption-value">
                  {hasMeasurement ? item.gas_consumption.toFixed(3) : "0.000"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

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
          {data.map((meter) => {
            const hasMeasurement = meter.waterCurrent !== null;

            return (
              <tr
                key={meter.apartment}
                className={!hasMeasurement ? "pending-row" : ""}
              >
                <td>
                  <strong>{meter.apartment}</strong>
                </td>
                <td>{meter.waterPrevious.toFixed(3)}</td>
                <td>
                  {hasMeasurement ? meter.waterCurrent?.toFixed(3) : "---"}
                </td>
                <td className="consumption-value">
                  {hasMeasurement ? meter.waterConsumption.toFixed(3) : "0.000"}
                </td>
                <td>{meter.gasPrevious.toFixed(3)}</td>
                <td>{hasMeasurement ? meter.gasCurrent?.toFixed(3) : "---"}</td>
                <td className="consumption-value">
                  {hasMeasurement ? meter.gasConsumption.toFixed(3) : "0.000"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

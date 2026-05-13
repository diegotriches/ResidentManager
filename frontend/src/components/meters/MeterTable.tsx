import type { MeterReportType } from "../../types/meters";

interface MeterTableProps {
  data: MeterReportType[];
  loading: boolean;
}

export const MeterTable: React.FC<MeterTableProps> = ({ data, loading }) => {
  if (loading) return <div className="loading">Carregando consumos...</div>;

  return (
    <div className="table-container">
      <table className="meters-table">
        <thead>
          <tr>
            <th>Apartamento</th>
            <th>Leitura Anterior (m³)</th>
            <th>Leitura Atual (m³)</th>
            <th>Consumo Água</th>
            <th>Leitura Anterior (m³)</th>
            <th>Leitura Atual (m³)</th>
            <th>Consumo Gás</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => {
            const hasMeasurement = item.water_current !== null;
            
            return (
              <tr key={item.apartment} className={!hasMeasurement ? "pending-row" : ""}>
                <td><strong>{item.apartment}</strong></td>
                <td>{item.water_previous.toFixed(3)}</td>
                <td>{hasMeasurement ? item.water_current?.toFixed(3) : "---"}</td>
                <td className="consumption-value">
                  {hasMeasurement ? item.water_consumption.toFixed(3) : "0.000"}
                </td>
                <td>{item.gas_previous.toFixed(3)}</td>
                <td>{hasMeasurement ? item.gas_current?.toFixed(3) : "---"}</td>
                <td className="consumption-value">
                  {hasMeasurement ? item.gas_consumption.toFixed(3) : "0.000"}
                </td>
                <td>
                  <span className={`badge ${hasMeasurement ? "status-ok" : "status-pending"}`}>
                    {hasMeasurement ? "Medido" : "Pendente"}
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
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import type { MetersType } from "../../types/meters";

interface MeterRecordsTableProps {
  meters: MetersType[];
  onEdit: (meter: MetersType) => void;
  onDelete: (id: number) => void;
}

export const MeterRecordsTable: React.FC<MeterRecordsTableProps> = ({ 
  meters, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="records-container">
      <table className="records-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Apartamento</th>
            <th>Cons. Água</th>
            <th>Cons. Gás</th>
            <th>Registro</th>
            <th>Atualização</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {meters.map((m) => (
            <tr key={m.meter_id}>
              <td>{m.meter_id}</td>
              <td><strong>Apto {m.apartment}</strong></td>
              <td>{m.water}</td>
              <td>{m.gas}</td>
              <td>
                {m.createdAt ? new Date(m.createdAt).toLocaleDateString() : "---"}
              </td>
              <td>
                {m.updatedAt ? new Date(m.updatedAt).toLocaleDateString() : "---"}
              </td>
              <td>
                <button 
                  className="btn-edit" 
                  onClick={() => onEdit(m)}
                  title="Editar medição"
                >
                  <FaPencilAlt />
                </button>
                <button 
                  className="btn-delete" 
                  onClick={() => onDelete(m.meter_id)}
                  title="Excluir medição"
                >
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
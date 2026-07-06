import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import type { MetersType } from "../../types/meters";

interface MeterRecordsTableProps {
  meters: MetersType[];
  onEdit: (meter: MetersType) => void;
  onDelete: (id: number) => void;
  loading: boolean;
}

export const MeterRecordsTable: React.FC<MeterRecordsTableProps> = ({
  meters,
  onEdit,
  onDelete,
  loading,
}) => {
  if (loading) return <h4>Carregando consumos...</h4>;
  if (!loading && meters.length === 0) {
    return <p>Nenhum registro encontrado. Crie registros no botão Nova Medição.</p>;
  }

  return (
    <div className="records-container">
      <table className="records-table">
        <thead>
          <tr>
            <th>Apto</th>
            <th>Cons. Água</th>
            <th>Cons. Gás</th>
            <th>Registro</th>
            <th>Atualização</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {meters.map((m) => (
            <tr key={m.id}>
              <td>
                <strong>{m.apartment}</strong>
              </td>
              <td>{m.water}</td>
              <td>{m.gas}</td>
              <td>
                {m.createdAt
                  ? new Date(m.createdAt).toLocaleDateString()
                  : "---"}
              </td>
              <td>
                {m.updatedAt
                  ? new Date(m.updatedAt).toLocaleDateString()
                  : "---"}
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
                  onClick={() => onDelete(m.id)}
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

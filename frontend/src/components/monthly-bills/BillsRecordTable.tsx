import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import type { BillsType } from "../../types/bills";
import { formatCurrency } from "../../utils/format";

interface BillsRecordsTableProps {
  bills: BillsType[];
  handleOpenEdit: (bills: BillsType) => void;
  deleteRequest: (id: number) => void;
}

export const BillsRecordsTable: React.FC<BillsRecordsTableProps> = ({
  bills,
  handleOpenEdit,
  deleteRequest,
}) => {
  return (
    <div className="records-container">
      <table className="records-table">
        <thead>
          <tr>
            <th>Despesa</th>
            <th>Valor Total</th>
            <th>Registro</th>
            <th>Atualizado</th>
            <th>Editar/Excluir</th>
          </tr>
        </thead>
        <tbody>
          {bills.map((b) => (
            <tr key={b.id}>
              <td>{b.bill}</td>
              <td>{formatCurrency(b.totalValue || 0)}</td>
              <td>{b.createdAt}</td>
              <td>{b.updatedAt}</td>
              <td>
                <button className="btn-edit" onClick={() => handleOpenEdit(b)}>
                  <FaPencilAlt />
                </button>
                <button
                  className="btn-delete"
                  onClick={() => deleteRequest(b.id)}
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

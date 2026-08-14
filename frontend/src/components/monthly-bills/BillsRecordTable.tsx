import { useState } from "react";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import type { BillsType } from "../../types/bills";
import { formatCurrency } from "../../utils/format";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface BillsRecordsTableProps {
  bills: BillsType[];
  billId: number | null;
  setBillId: (id: number | null) => void;
  handleEdit: (bills: BillsType) => void;
  handleDelete: (id: number) => void;
}

export const BillsRecordsTable: React.FC<BillsRecordsTableProps> = ({
  bills,
  billId,
  setBillId,
  handleEdit,
  handleDelete,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <div className="records-container">
        <table className="records-table">
          <thead>
            <tr>
              <th>Despesa</th>
              <th>Valor Total</th>
              <th>Atualizado</th>
              <th>Editar/Excluir</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill.id}>
                <td>{bill.bill}</td>
                <td>{formatCurrency(bill.totalValue || 0)}</td>
                <td>{bill.updatedAt}</td>
                <td>
                  <button
                    className="btn-edit"
                    onClick={() => handleEdit(bill)}
                  >
                    <FaPencilAlt />
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => {
                      setBillId(bill.id);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir conta?</AlertDialogTitle>

            <AlertDialogDescription>
              Tem certeza que deseja excluir esta conta? Esta ação não poderá
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>

            <AlertDialogAction
              onClick={() => {
                if (billId !== null) {
                  handleDelete(billId);
                }

                setIsDeleteDialogOpen(false);
                setBillId(null);
              }}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

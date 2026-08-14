import type { UtilityBillType } from "../../types/utilityBills";
import { formatCurrency, formatDecimal } from "../../utils/format";
import { FaDroplet, FaFireFlameCurved } from "react-icons/fa6";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { useState } from "react";
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

interface UtilityBillsViewProps {
  bills: UtilityBillType[];
  utilityBillId: number | null;
  setUtilityBillId: (id: number | null) => void;
  handleEdit: (bill: UtilityBillType) => void;
  handleDelete: (id: number) => void;
}

export const UtilityBillsView = ({
  bills,
  utilityBillId,
  setUtilityBillId,
  handleEdit,
  handleDelete,
}: UtilityBillsViewProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <div className="utility-view-container">
        {bills.length === 0 ? (
          <div className="empty-state">
            <p>
              Nenhuma fatura de água ou gás cadastrada para a data selecionada.
            </p>
          </div>
        ) : (
          <div
            className="utility-cards-grid"
            style={{
              display: "grid",
              gap: "20px",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            }}
          >
            {bills.map((bill) => (
              <div
                key={bill.id}
                className="utility-card"
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "15px",
                  backgroundColor: "var(--bg-primary)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "10px",
                    backgroundColor: "var(--bg-primary)",
                    color: "var(--text-primary)",
                  }}
                >
                  {bill.type === "water" ? (
                    <FaDroplet
                      style={{ color: "#3498db", fontSize: "1.5rem" }}
                    />
                  ) : (
                    <FaFireFlameCurved
                      style={{ color: "#e67e22", fontSize: "1.5rem" }}
                    />
                  )}
                  <h3 style={{ margin: 0 }}>
                    {bill.type === "water"
                      ? "Conta de Água"
                      : `Gás (${bill.cylinderType})`}
                  </h3>
                  <button onClick={() => handleEdit(bill)}>
                    <FaPencilAlt />
                  </button>
                  <button
                    onClick={() => {
                      setUtilityBillId(bill.id);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <FaTrashAlt />
                  </button>
                  <p>Atualizado: {bill.updatedAt}</p>
                </div>

                <div
                  className="card-body"
                  style={{
                    fontSize: "0.9rem",
                    backgroundColor: "var(--bg-primary)",
                    color: "var(--text-primary)",
                  }}
                >
                  {bill.type === "water" ? (
                    <>
                      <p>
                        Consumo Total:{" "}
                        <strong>
                          {parseFloat(formatDecimal(bill.totalConsumption))} m³
                        </strong>
                      </p>
                      <p>
                        Valor Consumo:{" "}
                        <strong>{formatCurrency(bill.consumptionValue)}</strong>
                      </p>
                      <p>
                        Taxas/Esgoto:{" "}
                        <strong>{formatCurrency(bill.taxesValue)}</strong>
                      </p>
                      <hr />
                      <p style={{ color: "#27ae60", fontWeight: "bold" }}>
                        Valor do m³:{" "}
                        {formatCurrency(
                          bill.consumptionValue! / bill.totalConsumption!,
                        )}
                      </p>
                    </>
                  ) : (
                    <>
                      <p>
                        Preço do Botijão:{" "}
                        <strong>{formatCurrency(bill.unitPrice)}</strong>
                      </p>
                      <p>
                        Fator de Correção:{" "}
                        <strong>{bill.multiplierFactor}x</strong>
                      </p>
                      <hr />
                      <p style={{ color: "#27ae60", fontWeight: "bold" }}>
                        Valor do kg:{" "}
                        {formatCurrency(
                          (bill.unitPrice! /
                            (bill.cylinderType === "P45" ? 45 : 90)) *
                            bill.multiplierFactor!,
                        )}
                      </p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
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
                if (utilityBillId !== null) {
                  handleDelete(utilityBillId);
                }

                setIsDeleteDialogOpen(false);
                setUtilityBillId(null);
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

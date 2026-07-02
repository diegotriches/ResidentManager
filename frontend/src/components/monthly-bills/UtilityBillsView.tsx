import type { UtilityBillType } from "../../types/utilityBills";
import { formatCurrency, formatDecimal } from "../../utils/format";
import { FaDroplet, FaFireFlameCurved } from "react-icons/fa6";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";

interface UtilityBillsViewProps {
  bills: UtilityBillType[];
  handleOpenEdit: (bills: UtilityBillType) => void;
  deleteRequest: (id: number) => void;
}

export const UtilityBillsView = ({
  bills,
  handleOpenEdit,
  deleteRequest,
}: UtilityBillsViewProps) => {
  return (
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
                  <FaDroplet style={{ color: "#3498db", fontSize: "1.5rem" }} />
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
                <button onClick={() => handleOpenEdit(bill)}>
                  <FaPencilAlt />
                </button>
                <button onClick={() => deleteRequest(bill.id)}>
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
                        {parseFloat(formatDecimal(bill.totalConsumptionM3))} m³
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
                        bill.consumptionValue! / bill.totalConsumptionM3!,
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
  );
};

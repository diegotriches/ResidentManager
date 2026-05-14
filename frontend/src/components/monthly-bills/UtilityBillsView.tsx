import { useState, useEffect } from "react";
import { useFilter } from "../../components/context/FilterContext";
import { formatCurrency, formatDecimal } from "../../utils/format";
import { FaDroplet, FaFireFlameCurved } from "react-icons/fa6";

interface UtilityBill {
  id: number;
  type: "water" | "gas";
  total_consumption_m3?: number;
  consumption_value?: number;
  taxes_value?: number;
  cylinder_type?: string;
  unit_price?: number;
  multiplier_factor?: number;
}

export const UtilityBillsView = () => {
  const { month, year } = useFilter();
  const [bills, setBills] = useState<UtilityBill[]>([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar os dados do backend
  const fetchUtilityBills = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/utility-bills?month=${month}&year=${year}`,
      );
      const data = await response.json();
      setBills(data);
    } catch (error) {
      console.error("Erro ao buscar faturas de concessionária:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUtilityBills();
  }, [month, year]);

  if (loading) return <p>Carregando faturas...</p>;

  return (
    <div className="utility-view-container">
      {bills.length === 0 ? (
        <div className="empty-state">
          <p>
            Nenhuma fatura de água ou gás cadastrada para {month}/{year}.
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
                background: "#fff",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "10px",
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
                    : `Gás (${bill.cylinder_type})`}
                </h3>
              </div>

              <div
                className="card-body"
                style={{ fontSize: "0.9rem", color: "#555" }}
              >
                {bill.type === "water" ? (
                  <>
                    <p>
                      Consumo Total:{" "}
                      <strong>
                        {formatDecimal(bill.total_consumption_m3)} m³
                      </strong>
                    </p>
                    <p>
                      Valor Consumo:{" "}
                      <strong>{formatCurrency(bill.consumption_value)}</strong>
                    </p>
                    <p>
                      Taxas/Esgoto:{" "}
                      <strong>{formatCurrency(bill.taxes_value)}</strong>
                    </p>
                    <hr />
                    <p style={{ color: "#27ae60", fontWeight: "bold" }}>
                      Valor do m³:{" "}
                      {formatCurrency(
                        bill.consumption_value! / bill.total_consumption_m3!,
                      )}
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      Preço do Botijão:{" "}
                      <strong>{formatCurrency(bill.unit_price)}</strong>
                    </p>
                    <p>
                      Fator de Correção:{" "}
                      <strong>{bill.multiplier_factor}x</strong>
                    </p>
                    <hr />
                    <p style={{ color: "#27ae60", fontWeight: "bold" }}>
                      {/* Cálculo: (Preço / KG) * Fator */}
                      Valor do kg:{" "}
                      {formatCurrency(
                        (bill.unit_price! /
                          (bill.cylinder_type === "P20"
                            ? 20
                            : bill.cylinder_type === "P45"
                              ? 45
                              : 90)) *
                          bill.multiplier_factor!,
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

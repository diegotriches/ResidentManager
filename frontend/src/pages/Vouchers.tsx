import { useVouchers } from "../hooks/useVouchers";
import { useFilter } from "../context/FilterContext";
import { formatCurrency } from "../utils/format";
import { exportVoucherToPDF } from "../utils/pdf";
import "./PagesStyles.css";
import { FaTasks } from "react-icons/fa";

export const Vouchers = () => {
  const { vouchers, loading, handleTogglePaid } = useVouchers();
  const { month, year } = useFilter();

  return (
    <div className="main-container">
      <header className="pages-header">
        <h1>
          <FaTasks /> Fechamento de Valores
        </h1>
      </header>

      <div className="records-container">
        <table className="records-table">
          <thead>
            <tr>
              <th>Apartamento</th>
              <th>Condomínio</th>
              <th>Água</th>
              <th>Gás</th>
              <th>Total a Pagar</th>
              <th>Pagamento</th>
              <th>Exportar</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5}>A calcular valores...</td>
              </tr>
            ) : (
              vouchers.map((v) => (
                <tr key={v.apartment}>
                  <td>
                    <strong>Apto {v.apartment}</strong>
                  </td>
                  <td>{formatCurrency(v.fixedRate)}</td>
                  <td>{formatCurrency(v.waterTotalValue)}</td>
                  <td>{formatCurrency(v.gasValue)}</td>
                  <td
                    style={{
                      fontWeight: "bold",
                      color: "#27ae60",
                    }}
                  >
                    {formatCurrency(v.total)}
                  </td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={v.isPaid}
                        onChange={() => handleTogglePaid(v.apartment, v.isPaid)}
                        style={{
                          cursor: "pointer",
                          width: "16px",
                          height: "16px",
                        }}
                      />
                      <span
                        style={{
                          fontWeight: "500",
                          color: v.isPaid ? "#27ae60" : "#c0392b",
                        }}
                      >
                        {v.isPaid ? "Pago" : "Em aberto"}
                      </span>
                    </div>
                  </td>
                  <td>
                    <button
                      onClick={() => exportVoucherToPDF(v, Number(month), Number(year))}
                      className="pdf-btn"
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#e74c3c", // Vermelho padrão para lembrar PDF
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "12px",
                      }}
                    >
                      📄 Gerar PDF
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

import { useState, useEffect } from "react";
import { useFilter } from "../components/context/FilterContext";
import { getBills } from "../services/billsService";
import { getConsumptionReport } from "../services/metersService";
import { formatCurrency } from "../utils/format";
import "./PagesStyles.css";

interface VoucherData {
  apartment: number;
  fixedRate: number;
  waterValue: number;
  gasValue: number;
  total: number;
}

export const Vouchers = () => {
  const { month, year } = useFilter();
  const [vouchers, setVouchers] = useState<VoucherData[]>([]);
  const [loading, setLoading] = useState(false);
  const [waterUnitPrice, setWaterUnitPrice] = useState(0);
  const [gasUnitPrice, setGasUnitPrice] = useState(0);

  const calculateVouchers = async () => {
    setLoading(true);
    try {
      // 1. Obter faturas e calcular taxa fixa (Rateio por 21)
      const bills = await getBills(month, year);
      const totalBills = bills.reduce((acc, b) => acc + (b.totalValue || 0), 0);
      const fixedRate = totalBills / 21;

      // 2. Obter relatório de consumo (Água e Gás)
      const consumptionData = await getConsumptionReport(month, year);

      // 3. Cruzar os dados
      const combined = consumptionData.map((item: any): VoucherData => {
        const waterValue = (item.water_consumption || 0) * waterUnitPrice;
        const gasValue = (item.gas_consumption || 0) * gasUnitPrice;

        return {
          apartment: item.apartment,
          fixedRate: fixedRate,
          waterValue: waterValue,
          gasValue: gasValue,
          total: fixedRate + waterValue + gasValue,
        };
      });

      setVouchers(combined);
    } catch (error) {
      console.error("Erro ao gerar vouchers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateVouchers();
  }, [month, year, waterUnitPrice, gasUnitPrice]);

  return (
    <div className="main-container">
      <header className="pages-header">
        <h1>Fechamento de Vouchers</h1>
        <div className="header-controls">
          <div className="input-group">
            <label>R$ m³ Água:</label>
            <input
              type="number"
              step="0.01"
              value={waterUnitPrice}
              onChange={(e) => setWaterUnitPrice(Number(e.target.value))}
            />
          </div>
          <div className="input-group">
            <label>R$ kg Gás:</label>
            <input
              type="number"
              step="0.01"
              value={gasUnitPrice}
              onChange={(e) => setGasUnitPrice(Number(e.target.value))}
            />
          </div>
        </div>
      </header>

      <div className="tab-content">
        <div className="records-container">
          <table className="records-table">
            <thead>
              <tr>
                <th>Apartamento</th>
                <th>Taxa Fixa (Rateio)</th>
                <th>Consumo Água (R$)</th>
                <th>Consumo Gás (R$)</th>
                <th>Total a Pagar</th>
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
                    <td>{formatCurrency(v.waterValue)}</td>
                    <td>{formatCurrency(v.gasValue)}</td>
                    <td
                      style={{
                        fontWeight: "bold",
                        color: "#27ae60",
                        background: "#f9f9f9",
                      }}
                    >
                      {formatCurrency(v.total)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

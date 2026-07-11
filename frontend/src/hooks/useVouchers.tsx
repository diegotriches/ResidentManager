import { useState, useEffect } from "react";
import { useFilter } from "../context/FilterContext";
import { getBills } from "../services/billsService";
import { getUtilityBills } from "../services/utilityBillsService";
import { getFinanceReport, updateVoucherStatus } from "../services/vouchersService";
import type { UtilityBillType } from "../types/utilityBills";
import type { VoucherReportItem } from "../types/vouchers";

export const useVouchers = () => {
  const { month, year } = useFilter();
  const [vouchers, setVouchers] = useState<VoucherReportItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [gasUnitPrice, setGasUnitPrice] = useState(0);

  const calculateVouchers = async () => {
    setLoading(true);
    try {
      const bills = await getBills(month, year);
      const utilityBills = await getUtilityBills(month, year);

      const totalBills = bills.reduce((acc, b) => acc + (b.totalValue || 0), 0);
      const fixedRate = totalBills / 21;

      const calculateGasUnitPrice = (bill: UtilityBillType) => {
        if (!bill.unitPrice || !bill.multiplierFactor) return 0;
        const weight = bill.cylinderType === "P45" ? 45 : 90;
        return (bill.unitPrice / weight) * bill.multiplierFactor;
      }

      let calculatedGasPrice = 0;
      const gasBill = utilityBills.find((b) => b.type === "gas");
      if (gasBill) {
        calculatedGasPrice = calculateGasUnitPrice(gasBill);
        setGasUnitPrice(calculatedGasPrice);
      } else {
        setGasUnitPrice(0);
      }

      const consumptionData = await getFinanceReport(month, year);

      const combined = consumptionData.map((item: VoucherReportItem) => {
        const waterTotalValue = item.totalWaterValue || 0;
        const gasValue = (item.gasConsumption || 0) * calculatedGasPrice;

        return {
          apartment: item.apartment,
          fixedRate,
          waterTotalValue,
          gasValue,
          total: fixedRate + waterTotalValue + gasValue,
          isPaid: item.isPaid,
        };
      });

      setVouchers(combined);
    } catch (error) {
      console.error("Erro ao gerar vouchers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePaid = async (apartment: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;

    setVouchers((prev) =>
      prev.map((v) => (v.apartment === apartment ? { ...v, isPaid: newStatus } : v))
    );

    try {
      await updateVoucherStatus(apartment, month, year, newStatus);
    } catch (error) {
      console.error("Erro ao salvar status no banco, revertendo...", error);
      setVouchers((prev) =>
        prev.map((v) => (v.apartment === apartment ? { ...v, isPaid: currentStatus } : v))
      );
    }
  };

  useEffect(() => {
    calculateVouchers();
  }, [month, year, gasUnitPrice]);

  return { vouchers, loading, handleTogglePaid };
};
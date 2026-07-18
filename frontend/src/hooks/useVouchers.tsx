import { useState, useEffect } from "react";
import { useFilter } from "../context/FilterContext";
import { getBills } from "../services/billsService";
import { getUtilityBills } from "../services/utilityBillsService";
import {
  getFinanceReport,
  updateVoucherStatus,
} from "../services/vouchersService";
import type { UtilityBillType } from "../types/utilityBills";
import type { BackendVoucherReport, FrontendVoucher } from "../types/vouchers";

export const useVouchers = () => {
  const { month, year } = useFilter();

  const [vouchers, setVouchers] = useState<FrontendVoucher[]>([]);
  const [loading, setLoading] = useState(false);
  const [gasUnitPrice, setGasUnitPrice] = useState(0);

  const calculateVouchers = async () => {
    setLoading(true);
    try {
      const bills = await getBills(month, year);
      const utilityBills = await getUtilityBills(month, year);
      const consumptionData: BackendVoucherReport[] = await getFinanceReport(
        month,
        year,
      );

      const totalApartments = consumptionData.length;
      const totalBills = bills.reduce((acc, b) => acc + (b.totalValue || 0), 0);
      const fixedRate = totalApartments > 0 ? totalBills / totalApartments : 0;

      const calculateGasUnitPrice = (bill: UtilityBillType) => {
        if (!bill.unitPrice || !bill.multiplierFactor) return 0;
        const weight = bill.cylinderType === "P45" ? 45 : 90;
        return (bill.unitPrice / weight) * bill.multiplierFactor;
      };

      let calculatedGasPrice = 0;
      const gasBill = utilityBills.find((b) => b.type === "gas");
      if (gasBill) {
        calculatedGasPrice = calculateGasUnitPrice(gasBill);
        setGasUnitPrice(calculatedGasPrice);
      } else {
        setGasUnitPrice(0);
      }

      const combined: FrontendVoucher[] = consumptionData.map((item) => {
        const totalWaterValue = item.totalWaterValue || 0;
        const gasValue = (item.gasConsumption || 0) * calculatedGasPrice;

        return {
          apartmentId: item.apartmentId,
          apartment: item.apartment,
          fixedRate,
          totalWaterValue,
          gasValue,
          total: fixedRate + totalWaterValue + gasValue,
          isPaid: Boolean(item.isPaid),
        };
      });

      setVouchers(combined);
    } catch (error) {
      console.error("Erro ao gerar vouchers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePaid = async (
    apartmentId: number,
    currentStatus: boolean,
  ) => {
    const newStatus = !currentStatus;

    setVouchers((prev) =>
      prev.map((v) =>
        v.apartmentId === apartmentId ? { ...v, isPaid: newStatus } : v,
      ),
    );

    try {
      await updateVoucherStatus(apartmentId, month, year, newStatus);
    } catch (error) {
      console.error("Erro ao salvar status no banco, revertendo...", error);
      setVouchers((prev) =>
        prev.map((v) =>
          v.apartmentId === apartmentId ? { ...v, isPaid: currentStatus } : v,
        ),
      );
    }
  };

  useEffect(() => {
    calculateVouchers();
  }, [month, year, gasUnitPrice]);

  return { vouchers, loading, handleTogglePaid };
};

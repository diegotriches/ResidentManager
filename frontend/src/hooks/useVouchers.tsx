import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useFilter } from "../context/FilterContext";
import { getBills } from "../services/billsService";
import { getUtilityBills } from "../services/utilityBillsService";
import {
  getFinanceReport,
  updateVoucherStatus,
} from "../services/vouchersService";
import type { UtilityBillType } from "../types/utilityBills";
import type { BackendVoucherReport, FrontendVoucher } from "../types/vouchers";
import { queryKeys } from "../keys/queryKeys";
import type { BillsType } from "../types/bills";
import { toast } from "sonner";

// Função utilitária para cálculo do preço unitário do gás
const calculateGasUnitPrice = (bill: UtilityBillType) => {
  if (!bill.unitPrice || !bill.multiplierFactor) return 0;
  const weight = bill.cylinderType === "P45" ? 45 : 90;
  return (bill.unitPrice / weight) * bill.multiplierFactor;
};

export const useVouchers = () => {
  const { month, year } = useFilter();
  const queryClient = useQueryClient();

  // 1. Busca agregada de dados (Bills, UtilityBills e FinanceReport)
  const {
    data: vouchers = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: queryKeys.vouchers?.byDate
      ? queryKeys.vouchers.byDate(month, year)
      : ["vouchers", month, year],
    queryFn: async () => {
      // Executa as requisições em paralelo para máxima performance
      const [bills, utilityBills, consumptionData]: [
        BillsType[],
        UtilityBillType[],
        BackendVoucherReport[],
      ] = await Promise.all([
        getBills(month, year),
        getUtilityBills(month, year),
        getFinanceReport(month, year),
      ]);

      // Cálculos da taxa fixa de condomínio
      const totalApartments = consumptionData.length;
      const totalBills = bills.reduce((acc, b) => acc + (b.totalValue || 0), 0);
      const fixedRate = totalApartments > 0 ? totalBills / totalApartments : 0;

      // Cálculo do preço unitário do gás
      const gasBill = utilityBills.find((b) => b.type === "gas");
      const calculatedGasPrice = gasBill ? calculateGasUnitPrice(gasBill) : 0;

      // Montagem da lista final de Vouchers
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

      return combined;
    },
  });

  // 2. Mutation para alterar status de pagamento (com atualização otimista)
  const togglePaidMutation = useMutation({
    mutationFn: ({
      apartmentId,
      newStatus,
    }: {
      apartmentId: number;
      newStatus: boolean;
    }) => updateVoucherStatus(apartmentId, month, year, newStatus),

    // Atualização otimista na interface antes do servidor responder
    onMutate: async ({ apartmentId, newStatus }) => {
      const currentQueryKey = queryKeys.vouchers?.byDate
        ? queryKeys.vouchers.byDate(month, year)
        : ["vouchers", month, year];

      // Cancela refetches em andamento para não sobrescrever nossa mudança otimista
      await queryClient.cancelQueries({ queryKey: currentQueryKey });

      // Salva o estado anterior do cache (para o caso de dar erro e precisar reverter)
      const previousVouchers =
        queryClient.getQueryData<FrontendVoucher[]>(currentQueryKey);

      // Atualiza o cache local imediatamente
      queryClient.setQueryData<FrontendVoucher[]>(currentQueryKey, (old = []) =>
        old.map((v) =>
          v.apartmentId === apartmentId ? { ...v, isPaid: newStatus } : v,
        ),
      );

      return { previousVouchers, currentQueryKey };
    },

    // Em caso de erro do servidor, restaura o estado anterior
    onError: (err, _variables, context) => {
      console.error("Erro ao atualizar status de pagamento:", err);

      if (context?.previousVouchers) {
        queryClient.setQueryData(
          context.currentQueryKey,
          context.previousVouchers,
        );
      }

      toast?.success("Não foi possível atualizar o status de pagamento.");
    },

    // Sempre invalida ao final para ter certeza que os dados estão sincronizados com o banco
    onSettled: (_data, _error, _variables, context) => {
      if (context?.currentQueryKey) {
        queryClient.invalidateQueries({ queryKey: context.currentQueryKey });
      }
    },
  });

  const handleTogglePaid = (apartmentId: number, currentStatus: boolean) => {
    togglePaidMutation.mutate({
      apartmentId,
      newStatus: !currentStatus,
    });
  };

  return {
    vouchers,
    loading: isLoading,
    isFetching,
    handleTogglePaid,
  };
};

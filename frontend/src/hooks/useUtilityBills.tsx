import { useState } from "react";
import { useFilter } from "../context/FilterContext";
import {
  getUtilityBills,
  createUtilityBill,
  updateUtilityBill,
  deleteUtilityBill,
} from "../services/utilityBillsService";
import type {
  UtilityBillType,
  UtilityFormDataType,
} from "../types/utilityBills";
import { queryKeys } from "../keys/queryKeys";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface useUtilityBillsProps {
  setModalConfig: (config: {
    isOpen: boolean;
    message: string;
    title: string;
    type: "confirm" | "alert";
    onConfirm?: () => void;
  }) => void;
}

export const useUtilityBills = ({ setModalConfig }: useUtilityBillsProps) => {
  const { month, year } = useFilter();
  const queryClient = useQueryClient();

  const initialForm: UtilityFormDataType = {
    type: "water",
    month,
    year,
    totalConsumption: 0,
    consumptionValue: 0,
    taxesValue: 0,
    cylinderType: "P45",
    unitPrice: 0,
    multiplierFactor: 2.25,
  };

  const [formData, setFormData] = useState<UtilityFormDataType>(initialForm);
  const [utilityBillId, setUtilityBillId] = useState<number | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const { data: utilityBills = [], isLoading: isLoading } = useQuery({
    queryKey: queryKeys.utilityBills.byDate(month, year),
    queryFn: () => getUtilityBills(month, year),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.utilityBills.all });
  };

  const createMutation = useMutation({
    mutationFn: createUtilityBill,
    onSuccess: () => {
      invalidate();
      toast.success("Conta cadastrada com sucesso!");
      setIsFormModalOpen(false);
      resetForm();
    },
    onError: (error) => {
      console.error("Erro ao cadastrar conta:", error);
      toast.error("Ocorreu um erro ao processar a solicitação.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UtilityFormDataType }) =>
      updateUtilityBill(id, data),
    onSuccess: () => {
      invalidate();
      toast.success("Conta atualizada com sucesso!");
      setIsFormModalOpen(false);
      resetForm();
    },
    onError: (error) => {
      console.error("Erro ao atualizar conta:", error);
      toast.error("Ocorreu um erro ao processar a solicitação.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUtilityBill,
    onSuccess: () => {
      invalidate();
      toast.success("Conta removida com sucesso!");
      setIsFormModalOpen(false);
      setUtilityBillId(null);
    },
    onError: (error) => {
      console.error("Erro ao deletar conta:", error);
      toast.error("Ocorreu um problema ao tentar excluir a conta.");
    },
  });

  const resetForm = () => {
    setFormData(initialForm);
    setUtilityBillId(null);
  };

  const handleSubmit = async (): Promise<boolean> => {
    try {
      if (utilityBillId) {
        await updateMutation.mutateAsync({ id: utilityBillId, data: formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
      return true;
    } catch {
      return false;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const numericFields = [
        "month",
        "year",
        "totalConsumption",
        "consumptionValue",
        "taxesValue",
        "unitPrice",
        "multiplierFactor",
      ];

      const processedValue = numericFields.includes(name)
        ? parseFloat(value) || 0
        : value;

      return {
        ...prev,
        [name]: processedValue,
      };
    });
  };

  const handleEdit = (b: UtilityBillType) => {
    setUtilityBillId(b.id ?? null);
    setFormData({
      type: b.type,
      month: b.month,
      year: b.year,
      totalConsumption: b.totalConsumption,
      consumptionValue: b.consumptionValue,
      taxesValue: b.taxesValue,
      cylinderType: b.cylinderType,
      unitPrice: b.unitPrice,
      multiplierFactor: b.multiplierFactor,
    });
    setIsFormModalOpen(true);
  };

  const deleteRequest = (id: number) => {
    setUtilityBillId(id);
    setModalConfig({
      isOpen: true,
      title: "Confirmação",
      message: "Tem certeza que deseja excluir esta conta?",
      type: "confirm",
      onConfirm: () => handleDelete(id),
    });
  };

  const handleDelete = async (id: number) => {
    await deleteMutation.mutateAsync(id);
  };

  return {
    loading:
      isLoading ||
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
    isFormModalOpen,
    setIsFormModalOpen,
    utilityBills,
    formData,
    setFormData,
    utilityBillId,
    handleChange,
    handleEdit,
    handleSubmit,
    deleteRequest,
    resetForm,
  };
};

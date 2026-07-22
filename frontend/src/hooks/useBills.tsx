import { useState } from "react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useFilter } from "../context/FilterContext";
import {
  getBills,
  createBills,
  updateBills,
  deleteBills,
} from "../services/billsService";
import type { BillsType, BillsFormData } from "../types/bills";
import { queryKeys } from "../keys/queryKeys";

interface useBillsProps {
  setModalConfig: (config: {
    isOpen: boolean;
    message: string;
    title: string;
    type: "confirm" | "alert";
    onConfirm?: () => void;
  }) => void;
}

export const useBills = ({ setModalConfig }: useBillsProps) => {
  const { month, year } = useFilter();
  const queryClient = useQueryClient();

  const initialForm: BillsFormData = {
    month,
    year,
    bill: "",
    totalValue: 0,
  };

  const [formData, setFormData] = useState<BillsFormData>(initialForm);
  const [billId, setBillId] = useState<number | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const { data: bills = [], isLoading: isLoading } = useQuery({
    queryKey: queryKeys.bills.byDate(month, year),
    queryFn: () => getBills(month, year),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.bills.all });
  };

  const createMutation = useMutation({
    mutationFn: createBills,
    onSuccess: () => {
      invalidate();
      setModalConfig({
        isOpen: true,
        title: "Cadastro",
        message: "Conta cadastrada com sucesso!",
        type: "alert",
      });
      resetForm();
    },
    onError: (error) => {
      console.error("Erro ao cadastrar conta:", error);
      setModalConfig({
        isOpen: true,
        title: "Erro",
        message: "Ocorreu um erro ao processar a solicitação.",
        type: "alert",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: BillsFormData }) =>
      updateBills(id, data),
    onSuccess: () => {
      invalidate();
      setModalConfig({
        isOpen: true,
        title: "Atualização",
        message: "Conta atualizada com sucesso!",
        type: "alert",
      });
      resetForm();
    },
    onError: (error) => {
      console.error("Erro ao atualizar conta:", error);
      setModalConfig({
        isOpen: true,
        title: "Erro",
        message: "Ocorreu um erro ao processar a solicitação.",
        type: "alert",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBills,
    onSuccess: () => {
      invalidate();
      setModalConfig({
        isOpen: true,
        title: "Sucesso",
        message: "Conta removida com sucesso!",
        type: "alert",
      });
      setBillId(null);
    },
    onError: (error) => {
      console.error("Erro ao deletar conta:", error);
      setModalConfig({
        isOpen: true,
        title: "Erro",
        message: "Ocorreu um problema ao tentar excluir a conta.",
        type: "alert",
      });
    },
  });

  const resetForm = () => {
    setFormData(initialForm);
    setBillId(null);
  };

  const handleSubmit = async (): Promise<boolean> => {
    try {
      if (billId) {
        await updateMutation.mutateAsync({ id: billId, data: formData });
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
    const { name, value, type } = e.target;

    const finalValue = type === "number" ? Number(value) : value;

    setFormData((prev) => {
      const newData = { ...prev, [name]: finalValue };

      return newData;
    });
  };

  const handleEdit = (bill: BillsType) => {
    setBillId(bill.id);
    setFormData({
      month: bill.month,
      year: bill.year,
      bill: bill.bill,
      totalValue: bill.totalValue,
    });
    setIsFormModalOpen(true);
  };

  const deleteRequest = (id: number) => {
    setBillId(id);
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
    bills,
    formData,
    billId,
    handleChange,
    handleEdit,
    handleSubmit,
    deleteRequest,
    resetForm,
  };
};

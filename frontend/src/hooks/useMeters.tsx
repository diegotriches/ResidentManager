import { useState } from "react";
import { useFilter } from "../context/FilterContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMeters,
  getConsumptionReport,
  createMeters,
  deleteMeters,
  updateMeters,
} from "../services/metersService";
import type { MeterFormData } from "../types/meters";
import { queryKeys } from "../keys/queryKeys";
import { toast } from "sonner";

export const useMeters = () => {
  const { month, year } = useFilter();
  const queryClient = useQueryClient();

  const initialForm: MeterFormData = {
    month,
    year,
    apartmentId: 0,
    water: 0,
    gas: 0,
  };

  const [formData, setFormData] = useState<MeterFormData>(initialForm);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingMeterId, setEditingMeterId] = useState<number | null>(null);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);

  // 1. QUERY: Busca das Medições (Reage a mês/ano automaticamente)
  const { data: meters = [], isLoading: isLoadingMeters } = useQuery({
    queryKey: queryKeys.meters.byDate(month, year),
    queryFn: () => getMeters(month, year),
  });

  // 2. QUERY: Busca do Relatório de Consumo
  const { data: reportData = [], isLoading: isLoadingReport } = useQuery({
    queryKey: queryKeys.meters.report(month, year),
    queryFn: () => getConsumptionReport(month, year),
  });

  // Função auxiliar para recarregar as duas queries após qualquer alteração
  const invalidateMetersAndReports = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.meters.all });
  };

  // 3. MUTATION: Criar Medição
  const createMutation = useMutation({
    mutationFn: createMeters,
    onSuccess: () => {
      invalidateMetersAndReports();
      toast.success("Medição cadastrada com sucesso!");
      setIsFormModalOpen(false);
      resetForm();
    },
    onError: (error) => {
      console.error("Erro ao cadastrar medição:", error);
      toast.error("Ocorreu um erro ao processar a solicitação.");
    },
  });

  // 4. MUTATION: Atualizar Medição
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: MeterFormData }) =>
      updateMeters(id, data),
    onSuccess: () => {
      invalidateMetersAndReports();
      toast.success("Medição atualizada com sucesso!");
      setIsFormModalOpen(false);
      resetForm();
    },
    onError: (error) => {
      console.error("Erro ao atualizar medição:", error);
      toast.error("Ocorreu um erro ao processar a solicitação.");
    },
  });

  // 5. MUTATION: Deletar Medição
  const deleteMutation = useMutation({
    mutationFn: deleteMeters,
    onSuccess: () => {
      invalidateMetersAndReports();
      toast.success("Medição removida com sucesso!");
      setIsFormModalOpen(false);
      setIdToDelete(null);
    },
    onError: (error) => {
      console.error("Erro ao deletar medição:", error);
      toast.error("Ocorreu um problema ao tentar excluir a medição.");
    },
  });

  const resetForm = () => {
    setFormData(initialForm);
    setEditingMeterId(null);
  };

  const handleSubmit = async (): Promise<boolean> => {
    try {
      if (editingMeterId) {
        await updateMutation.mutateAsync({
          id: editingMeterId,
          data: formData,
        });
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
      const numericFields = ["year", "apartmentId", "water", "gas"];
      const processedValue = numericFields.includes(name)
        ? parseFloat(value) || 0
        : value;

      return {
        ...prev,
        [name]: processedValue,
      };
    });
  };

  const handleEdit = (meter: (typeof meters)[0]) => {
    setEditingMeterId(meter.id);
    setFormData({
      month: meter.month,
      year: meter.year,
      apartmentId: meter.apartmentId,
      water: meter.water,
      gas: meter.gas,
    });
    setIsFormModalOpen(true);
  };

  const handleDelete = async (id: number) => {
      await deleteMutation.mutateAsync(id);
  };

  const loading =
    isLoadingMeters ||
    isLoadingReport ||
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  return {
    initialForm,
    meters,
    reportData,
    loading,
    formData,
    setFormData,
    isFormModalOpen,
    setIsFormModalOpen,
    editingMeterId,
    setEditingMeterId,
    idToDelete,
    setIdToDelete,
    handleChange,
    handleEdit,
    handleSubmit,
    handleDelete,
  };
};

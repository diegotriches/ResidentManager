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

interface useMetersProps {
  setModalConfig: (config: {
    isOpen: boolean;
    message: string;
    title: string;
    type: "confirm" | "alert";
  }) => void;
}

export const useMeters = ({ setModalConfig }: useMetersProps) => {
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
      setModalConfig({
        isOpen: true,
        title: "Cadastro",
        message: "Medição cadastrada com sucesso!",
        type: "alert",
      });
      resetForm();
    },
    onError: (error) => {
      console.error("Erro ao cadastrar medição:", error);
      setModalConfig({
        isOpen: true,
        title: "Erro",
        message: "Ocorreu um erro ao processar a solicitação.",
        type: "alert",
      });
    },
  });

  // 4. MUTATION: Atualizar Medição
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: MeterFormData }) =>
      updateMeters(id, data),
    onSuccess: () => {
      invalidateMetersAndReports();
      setModalConfig({
        isOpen: true,
        title: "Atualização",
        message: "Medição atualizada com sucesso!",
        type: "alert",
      });
      resetForm();
    },
    onError: (error) => {
      console.error("Erro ao atualizar medição:", error);
      setModalConfig({
        isOpen: true,
        title: "Erro",
        message: "Ocorreu um erro ao processar a solicitação.",
        type: "alert",
      });
    },
  });

  // 5. MUTATION: Deletar Medição
  const deleteMutation = useMutation({
    mutationFn: deleteMeters,
    onSuccess: () => {
      invalidateMetersAndReports();
      setModalConfig({
        isOpen: true,
        title: "Sucesso",
        message: "Medição removida com sucesso!",
        type: "alert",
      });
      setIdToDelete(null);
    },
    onError: (error) => {
      console.error("Erro ao deletar medição:", error);
      setModalConfig({
        isOpen: true,
        title: "Erro",
        message: "Ocorreu um problema ao tentar excluir a medição.",
        type: "alert",
      });
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
  };

  const deleteRequest = (id: number) => {
    setIdToDelete(id);
    setModalConfig({
      isOpen: true,
      title: "Confirmação",
      message: "Tem certeza que deseja excluir esta medição?",
      type: "confirm",
    });
  };

  const handleDelete = async () => {
    if (idToDelete !== null) {
      await deleteMutation.mutateAsync(idToDelete);
    }
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
    handleChange,
    handleEdit,
    handleSubmit,
    deleteRequest,
    handleDelete,
  };
};

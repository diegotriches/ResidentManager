import { useState } from "react";
import { createMeters, deleteMeters, updateMeters } from "../services/metersService";
import type { MetersType, MeterFormData } from "../types/meters";

interface useMetersFormProps {
  initialForm: MeterFormData;
  fetchMeters: () => Promise<void>;
  setModalConfig: (config: {
    isOpen: boolean;
    message: string;
    title: string;
    type: "confirm" | "alert";
  }) => void;
}

export const useMeterForm = ({
  initialForm,
  fetchMeters,
  setModalConfig,
}: useMetersFormProps) => {
  const [formData, setFormData] = useState<MeterFormData>(initialForm);
  const [editingMeterId, setEditingMeterId] = useState<number | null>(null);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (meter: MetersType) => {
    console.log("Objeto recebido para edição:", meter);
    setEditingMeterId(meter.meter_id);
    setFormData({
      apartment: meter.apartment,
      water: meter.water,
      gas: meter.gas,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<boolean> => {
    e.preventDefault();

    try {
      if (editingMeterId) {
        await updateMeters(editingMeterId, formData);
        setModalConfig({
          isOpen: true,
          title: "Atualização",
          message: "Medição atualizada com sucesso!",
          type: "alert",
        });
      } else {
        await createMeters(formData);
        setModalConfig({
          isOpen: true,
          title: "Cadastro",
          message: "Medição cadastrada com sucesso!",
          type: "alert",
        });
      }

      setFormData(initialForm);
      setEditingMeterId(null);
      await fetchMeters();

      return true;
    } catch (error) {
      console.error("Erro na operação:", error);
      setModalConfig({
        isOpen: true,
        title: "Erro",
        message: "Ocorreu um erro ao processar a solicitação.",
        type: "alert",
      });
      return false;
    }
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
    try {
      if (idToDelete !== null) {
        await deleteMeters(idToDelete);
      }
      setModalConfig({
        isOpen: true,
        title: "Sucesso",
        message: "Medição removida com sucesso!",
        type: "alert",
      });
      fetchMeters();
    } catch (error) {
      console.error("Erro ao deletar:", error);
      setModalConfig({
        isOpen: true,
        title: "Erro",
        message: "Ocorreu um problema ao tentar excluir a medição.",
        type: "alert",
      });
    }
  };

  return {
    formData,
    setFormData,
    editingMeterId,
    setEditingMeterId,
    handleChange,
    handleEdit,
    handleSubmit,
    deleteRequest,
    handleDelete,
  };
};

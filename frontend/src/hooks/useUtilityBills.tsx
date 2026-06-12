import { useState, useEffect, useCallback } from "react";
import { useFilter } from "../context/FilterContext";
import {
  getUtilityBills,
  createUtilityBill,
  updateUtilityBill,
  deleteUtilityBill,
} from "../services/utilityBillsService";
import type {
  UtilityFormDataType,
  UtilityBillType,
} from "../types/utilityBills";

interface useUtilityBillsProps {
  setModalConfig: (config: {
    isOpen: boolean;
    message: string;
    title: string;
    type: "confirm" | "alert";
  }) => void;
}

export const useUtilityBills = ({ setModalConfig }: useUtilityBillsProps) => {
  const { month, year } = useFilter();
  const initialForm: UtilityFormDataType = {
    type: "water",
    month: String(new Date().getMonth() + 1).padStart(2, '0'),
    year: new Date().getFullYear(),
    totalConsumptionM3: 0,
    consumptionValue: 0,
    taxesValue: 0,
    cylinderType: "P45",
    unitPrice: 0,
    multiplierFactor: 2.25,
    splitCount: 21,
  };
  const [bills, setBills] = useState<UtilityBillType[]>([]);
  const [formData, setFormData] = useState<UtilityFormDataType>(initialForm);
  const [loading, setLoading] = useState(true);
  const [editingBillId, setEditingBillId] = useState<number | null>(null);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);

  // Função para carregar dados (memorizada para evitar loops)
  const fetchBills = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getUtilityBills(month, year);
      setBills(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  // Carrega as faturas automaticamente ao mudar o filtro de mês/ano
  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  const handleSubmit = async (): Promise<boolean> => {
    try {
      if (editingBillId) {
        await updateUtilityBill(editingBillId, formData);
        setModalConfig({
          isOpen: true,
          title: "Atualização",
          message: "Conta atualizada com sucesso!",
          type: "alert",
        });
      } else {
        await createUtilityBill(formData);
        setModalConfig({
          isOpen: true,
          title: "Cadastro",
          message: "Conta cadastrada com sucesso!",
          type: "alert",
        });
      }

      setFormData(initialForm);
      setEditingBillId(null);
      await fetchBills();

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      // Campos numéricos mapeados para conversão automática
      const numericFields = [
        "year",
        "totalConsumptionM3",
        "consumptionValue",
        "taxesValue",
        "unitPrice",
        "multiplierFactor",
        "splitCount",
      ];

      // Se o input alterado for um campo numérico, converte para número, senão mantém a string
      const processedValue = numericFields.includes(name)
        ? parseFloat(value) || 0
        : value;

      return {
        ...prev,
        [name]: processedValue,
      };
    });
  };

  const handleEdit = (bill: UtilityBillType) => {
    setEditingBillId(bill.id);
    setFormData({
      type: bill.type,
      month: bill.month,
      year: Number(bill.year),
      totalConsumptionM3: bill.totalConsumptionM3,
      consumptionValue: bill.consumptionValue,
      taxesValue: bill.taxesValue,
      cylinderType: bill.cylinderType,
      unitPrice: bill.unitPrice,
      multiplierFactor: bill.multiplierFactor,
      splitCount: bill.splitCount,
    });
  };

  const deleteRequest = (id: number) => {
    setIdToDelete(id);
    setModalConfig({
      isOpen: true,
      title: "Confirmação",
      message: "Tem certeza que deseja excluir esta conta?",
      type: "confirm",
    });
  };

  const handleDelete = async () => {
    try {
      if (idToDelete !== null) {
        await deleteUtilityBill(idToDelete);
      }
      setModalConfig({
        isOpen: true,
        title: "Sucesso",
        message: "Conta removida com sucesso!",
        type: "alert",
      });
      fetchBills();
    } catch (error) {
      console.error("Erro ao deletar:", error);
      setModalConfig({
        isOpen: true,
        title: "Erro",
        message: "Ocorreu um problema ao tentar excluir a conta.",
        type: "alert",
      });
    }
  };

  return {
    bills,
    formData,
    setFormData,
    editingBillId,
    setEditingBillId,
    handleSubmit,
    handleChange,
    handleEdit,
    deleteRequest,
    handleDelete,
    fetchBills,
    loading,
  };
};

import { useState } from "react";
import { createBills, deleteBills, updateBills } from "../services/billsService";
import type { BillsType, BillsFormData } from "../types/bills";

interface useBillFormProps {
  initialForm: BillsFormData;
  fetchBills: () => Promise<void>;
  setModalConfig: (config: {
    isOpen: boolean;
    message: string;
    title: string;
    type: "confirm" | "alert";
  }) => void;
}

export const useBillForm = ({
  initialForm,
  fetchBills,
  setModalConfig,
}: useBillFormProps) => {
  const [formData, setFormData] = useState<BillsFormData>(initialForm);
  const [editingBillId, setEditingBillId] = useState<number | null>(null);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (bill: BillsType) => {
    setEditingBillId(bill.bill_id);
    setFormData({
      bill: bill.bill,
      totalValue: bill.totalValue,
      unitValue: bill.unitValue,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<boolean> => {
    e.preventDefault();

    try {
      if (editingBillId) {
        await updateBills(editingBillId, formData);
        setModalConfig({
          isOpen: true,
          title: "Atualização",
          message: "Conta atualizada com sucesso!",
          type: "alert",
        });
      } else {
        await createBills(formData);
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
        await deleteBills(idToDelete);
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
    formData,
    setFormData,
    editingBillId,
    setEditingBillId,
    handleChange,
    handleEdit,
    handleSubmit,
    deleteRequest,
    handleDelete,
  };
};

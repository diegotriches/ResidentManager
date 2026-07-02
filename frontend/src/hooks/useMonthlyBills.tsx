import { useState, useEffect, useCallback } from "react";
import { useFilter } from "../context/FilterContext";

// Services
import {
  getBills,
  createBills,
  updateBills,
  deleteBills,
} from "../services/billsService";
import {
  getUtilityBills,
  createUtilityBill,
  updateUtilityBill,
  deleteUtilityBill,
} from "../services/utilityBillsService";

// Types
import type { BillsType, BillsFormData } from "../types/bills";
import type {
  UtilityBillType,
  UtilityFormDataType,
} from "../types/utilityBills";

interface useMonthlyBillsProps {
  setModalConfig: (config: {
    isOpen: boolean;
    message: string;
    title: string;
    type: "confirm" | "alert";
  }) => void;
}

export const useMonthlyBills = ({ setModalConfig }: useMonthlyBillsProps) => {
  const { month, year } = useFilter();

  // Controle de Aba Ativa ("condo" = despesas fixas, "utilities" = água e gás)
  const [activeTab, setActiveTab] = useState<"condo" | "utilities">("condo");
  const [loading, setLoading] = useState(true);

  // --- 1. ESTADOS E INITIAL FORMS DE CONDOMÍNIO (Standard) ---
  const initialStandardForm: BillsFormData = {
    month: month,
    year: Number(year),
    bill: "",
    totalValue: 0,
    unitValue: 0,
  };

  const [standardBills, setStandardBills] = useState<BillsType[]>([]);
  const [standardFormData, setStandardFormData] =
    useState<BillsFormData>(initialStandardForm);
  const [editingStandardBillId, setEditingStandardBillId] = useState<
    number | null
  >(null);

  // --- 2. ESTADOS E INITIAL FORMS DE CONSUMO (Utilities) ---
  const initialUtilityForm: UtilityFormDataType = {
    type: "water",
    month: month,
    year: Number(year),
    totalConsumptionM3: 0,
    consumptionValue: 0,
    taxesValue: 0,
    cylinderType: "P45",
    unitPrice: 0,
    multiplierFactor: 2.25,
    splitCount: 21,
  };

  const [utilityBills, setUtilityBills] = useState<UtilityBillType[]>([]);
  const [utilityFormData, setUtilityFormData] =
    useState<UtilityFormDataType>(initialUtilityForm);
  const [editingUtilityBillId, setEditingUtilityBillId] = useState<
    number | null
  >(null);

  // --- 3. ESTADO GLOBAL DE DELEÇÃO ---
  const [idToDelete, setIdToDelete] = useState<number | null>(null);

  // --- 4. FUNÇÃO DE BUSCA UNIFICADA (Disparada por aba ou filtro) ---
  const fetchBills = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === "utilities") {
        const data = await getUtilityBills(month, year);
        setUtilityBills(data);
      } else {
        const data = await getBills(month, year);
        setStandardBills(data);
      }
    } catch (error) {
      console.error("Erro ao buscar contas:", error);
    } finally {
      setLoading(false);
    }
  }, [month, year, activeTab]);

  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  // --- 5. HANDLERS DE INPUTS ISOLADOS ---
  const handleStandardChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setStandardFormData((prev) => {
      const newData = { ...prev, [name]: value };
      const numValue = parseFloat(value);

      if (!isNaN(numValue)) {
        if (name === "totalValue") {
          newData.unitValue = parseFloat((numValue / 21).toFixed(2));
        } else if (name === "unitValue") {
          newData.totalValue = parseFloat((numValue * 21).toFixed(2));
        }
      }
      return newData;
    });
  };

  const handleUtilityChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setUtilityFormData((prev) => {
      const numericFields = [
        "year",
        "totalConsumptionM3",
        "consumptionValue",
        "taxesValue",
        "unitPrice",
        "multiplierFactor",
        "splitCount",
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

  // --- 6. HANDLERS DE EDIÇÃO ISOLADOS ---
  const handleStandardEdit = (bill: BillsType) => {
    setEditingStandardBillId(bill.id ?? null); // Evita problemas se id for undefined na tipagem
    setStandardFormData({
      month: bill.month,
      year: bill.year,
      bill: bill.bill,
      totalValue: bill.totalValue,
      unitValue: bill.unitValue,
    });
  };

  const handleUtilityEdit = (bill: UtilityBillType) => {
    setEditingUtilityBillId(bill.id ?? null);
    setUtilityFormData({
      type: bill.type,
      month: bill.month,
      year: bill.year,
      totalConsumptionM3: bill.totalConsumptionM3,
      consumptionValue: bill.consumptionValue,
      taxesValue: bill.taxesValue,
      cylinderType: bill.cylinderType,
      unitPrice: bill.unitPrice,
      multiplierFactor: bill.multiplierFactor,
      splitCount: bill.splitCount,
    });
  };

  // --- 7. SUBMIT UNIFICADO E DINÂMICO ---
  const handleSubmit = async (): Promise<boolean> => {
    const isUtility = activeTab === "utilities";
    const currentId = isUtility ? editingUtilityBillId : editingStandardBillId;

    try {
      if (isUtility) {
        if (currentId) {
          await updateUtilityBill(currentId, utilityFormData);
        } else {
          await createUtilityBill(utilityFormData);
        }
        
        setUtilityFormData(initialUtilityForm);
        setEditingUtilityBillId(null);
      } else {
        if (currentId) {
          await updateBills(currentId, standardFormData);
        } else {
          await createBills(standardFormData);
        }

        setStandardFormData(initialStandardForm);
        setEditingStandardBillId(null);
      }

      setModalConfig({
        isOpen: true,
        title: currentId ? "Atualização" : "Cadastro",
        message: `Conta ${currentId ? "atualizada" : "cadastrada"} com sucesso!`,
        type: "alert",
      });

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

  // --- 8. DELEÇÃO UNIFICADA E DINÂMICA ---
  const deleteRequest = (id: number) => {
    setIdToDelete(id);
    setModalConfig({
      isOpen: true,
      title: "Confirmação",
      message: `Tem certeza que deseja excluir esta conta de ${activeTab === "utilities" ? "consumo" : "condomínio"}?`,
      type: "confirm",
    });
  };

  const handleDelete = async () => {
    try {
      if (idToDelete !== null) {
        if (activeTab === "utilities") {
          await deleteUtilityBill(idToDelete);
        } else {
          await deleteBills(idToDelete);
        }

        setModalConfig({
          isOpen: true,
          title: "Sucesso",
          message: "Conta removida com sucesso!",
          type: "alert",
        });
        setIdToDelete(null);
        fetchBills();
      }
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
    // Estado de abas e carregamento
    activeTab,
    setActiveTab,
    loading,
    fetchBills,

    // Dados e handlers do Condomínio (Standard)
    standardBills,
    standardFormData,
    setStandardFormData,
    editingStandardBillId,
    setEditingStandardBillId,
    handleStandardChange,
    handleStandardEdit,
    initialStandardForm,

    // Dados e handlers de Consumo (Utilities)
    utilityBills,
    utilityFormData,
    setUtilityFormData,
    editingUtilityBillId,
    setEditingUtilityBillId,
    handleUtilityChange,
    handleUtilityEdit,
    initialUtilityForm,

    // Funções de ação Globais/Unificadas
    handleSubmit,
    deleteRequest,
    handleDelete,
  };
};

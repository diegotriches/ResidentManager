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

  // --- 1. ESTADOS E INITIAL FORMS DE CONDOMÍNIO ---
  const initialForm: BillsFormData = {
    month: Number(month),
    year: Number(year),
    bill: "",
    totalValue: 0,
  };

  const [bills, setBills] = useState<BillsType[]>([]);
  const [formData, setFormData] = useState<BillsFormData>(initialForm);
  const [billId, setBillId] = useState<number | null>(null);

  // --- 2. ESTADOS E INITIAL FORMS DE CONSUMO (Utilities) ---
  const initialUtilityForm: UtilityFormDataType = {
    type: "water",
    month: Number(month),
    year: Number(year),
    totalConsumption: 0,
    consumptionValue: 0,
    taxesValue: 0,
    cylinderType: "P45",
    unitPrice: 0,
    multiplierFactor: 2.25,
  };

  const [utilityBills, setUtilityBills] = useState<UtilityBillType[]>([]);
  const [utilityFormData, setUtilityFormData] =
    useState<UtilityFormDataType>(initialUtilityForm);
  const [utilityBillId, setUtilityBillId] = useState<number | null>(null);

  // --- 4. FUNÇÃO DE BUSCA UNIFICADA (Disparada por aba ou filtro) ---
  const fetchBills = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === "utilities") {
        const data = await getUtilityBills(Number(month), Number(year));
        setUtilityBills(data);
      } else {
        const data = await getBills(month, year);
        setBills(data);
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

  const handleUtilityChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setUtilityFormData((prev) => {
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

  // --- 6. HANDLERS DE EDIÇÃO ISOLADOS ---
  const handleEdit = (bill: BillsType) => {
    setBillId(bill.id ?? null); // Evita problemas se id for undefined na tipagem
    setFormData({
      month: bill.month,
      year: bill.year,
      bill: bill.bill,
      totalValue: bill.totalValue,
    });
  };

  const handleUtilityEdit = (bill: UtilityBillType) => {
    setUtilityBillId(bill.id ?? null);
    setUtilityFormData({
      type: bill.type,
      month: bill.month,
      year: bill.year,
      totalConsumption: bill.totalConsumption,
      consumptionValue: bill.consumptionValue,
      taxesValue: bill.taxesValue,
      cylinderType: bill.cylinderType,
      unitPrice: bill.unitPrice,
      multiplierFactor: bill.multiplierFactor,
    });
  };

  // --- 7. SUBMIT UNIFICADO E DINÂMICO ---
  const handleSubmit = async (isUtilityParam?: boolean): Promise<boolean> => {
    const isUtility = isUtilityParam !== undefined ? isUtilityParam: (activeTab === "utilities");
    const currentId = isUtility ? utilityBillId : billId;

    try {
      if (isUtility) {
        if (currentId) {
          await updateUtilityBill(currentId, utilityFormData);
        } else {
          await createUtilityBill(utilityFormData);
        }

        setUtilityFormData(initialUtilityForm);
        setUtilityBillId(null);
      } else {
        if (currentId) {
          await updateBills(currentId, formData);
        } else {
          await createBills(formData);
        }

        setFormData(initialForm);
        setBillId(null);
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
    if (activeTab === "condo") {
      setBillId(id);
    } else if (activeTab === "utilities") {
      setUtilityBillId(id);
    }

    setModalConfig({
      isOpen: true,
      title: "Confirmação",
      message: `Tem certeza que deseja excluir esta conta de ${activeTab === "utilities" ? "consumo" : "condomínio"}?`,
      type: "confirm",
    });
  };

  const handleDelete = async () => {
    try {
      if (activeTab === "condo" && billId !== null) {
          await deleteBills(billId);
        } else if(activeTab === "utilities" && utilityBillId !== null) {
          await deleteUtilityBill(utilityBillId);
        }

        setModalConfig({
          isOpen: true,
          title: "Sucesso",
          message: "Conta removida com sucesso!",
          type: "alert",
        });

        setBillId(null);
        setUtilityBillId(null);
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
    // Estado de abas e carregamento
    activeTab,
    setActiveTab,
    loading,
    fetchBills,

    // Dados e handlers do Condomínio
    bills,
    formData,
    setFormData,
    billId,
    setBillId,
    handleChange,
    handleEdit,
    initialForm,

    // Dados e handlers de Consumo (Utilities)
    utilityBills,
    utilityFormData,
    setUtilityFormData,
    utilityBillId,
    setUtilityBillId,
    handleUtilityChange,
    handleUtilityEdit,
    initialUtilityForm,

    // Funções de ação Globais/Unificadas
    handleSubmit,
    deleteRequest,
    handleDelete,
  };
};

import { useState, useEffect, useCallback } from "react";
import {
  getMeters,
  getConsumptionReport,
  createMeters,
  deleteMeters,
  updateMeters,
} from "../services/metersService";
import type {
  MetersType,
  MeterFormData,
  MeterReportType,
} from "../types/meters";
import { useFilter } from "../context/FilterContext";

interface useMetersFormProps {
  setModalConfig: (config: {
    isOpen: boolean;
    message: string;
    title: string;
    type: "confirm" | "alert";
  }) => void;
}

export const useMeterForm = ({ setModalConfig }: useMetersFormProps) => {
  const getInitialForm = (): MeterFormData => {
    const savedDate = localStorage.getItem("lastMeter");

    if (savedDate) {
      const { month, year, apartment } = JSON.parse(savedDate);

      return {
        month,
        year,
        apartment: apartment ?? 201,
        water: 0,
        gas: 0,
      };
    }

    return {
      month: String(new Date().getMonth() + 1).padStart(2, "0"),
      year: new Date().getFullYear(),
      apartment: 201,
      water: 0,
      gas: 0,
    };
  };

  const { month, year } = useFilter();
  const initialForm = getInitialForm();

  const [meters, setMeters] = useState<MetersType[]>([]);
  const [reportData, setReportData] = useState<MeterReportType[]>([]);
  const [formData, setFormData] = useState<MeterFormData>(() =>
    getInitialForm(),
  );
  const [loading, setLoading] = useState(false);
  const [editingMeterId, setEditingMeterId] = useState<number | null>(null);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);

  // Memorizado com useCallback para evitar recriação constante e loops
  const fetchMeters = useCallback(async () => {
    try {
      const response = await getMeters(month, year);
      setMeters(response);
    } catch (error) {
      console.error("Erro ao carregar medições:", error);
    }
  }, [month, year]);

  // Memorizado para sincronização perfeita com os filtros
  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getConsumptionReport(month, year);
      setReportData(data);
    } catch (error) {
      console.error("Erro ao carregar relatório:", error);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  // Efeito unificado para recarregar tudo quando o filtro global de mês/ano mudar
  useEffect(() => {
    fetchMeters();
    fetchReport();
  }, [fetchMeters, fetchReport]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<boolean> => {
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

      localStorage.setItem(
        "lastMeter",
        JSON.stringify({
          month: formData.month,
          year: formData.year,
          apartment: formData.apartment,
        }),
      );

      setFormData(initialForm);
      setEditingMeterId(null);
      await fetchMeters();
      await fetchReport();

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
      const numericFields = ["year", "apartment", "water", "gas"];
      const processedValue = numericFields.includes(name)
        ? parseFloat(value) || 0
        : value;

      return {
        ...prev,
        [name]: processedValue,
      };
    });
  };

  const handleEdit = (meter: MetersType) => {
    setEditingMeterId(meter.id);
    setFormData({
      month: meter.month,
      year: Number(meter.year),
      apartment: Number(meter.apartment),
      water: Number(meter.water),
      gas: Number(meter.gas),
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

      // Recarrega os dados e o relatório de consumos após deletar
      await fetchMeters();
      await fetchReport();
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
    initialForm,
    meters,
    reportData,
    loading,
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

import { useState, useEffect } from "react";
import { MetersForm } from "../components/meters/MetersForm";
import { FilterBar } from "../components/layout/FilterBar";
import { MeterTable } from "../components/meters/MeterTable";
import { Modal } from "../components/ui/Modal";
import { getMeters, getConsumptionReport } from "../services/metersService";
import { useMeterForm } from "../hooks/useMeterForm";
import type { MetersType, MeterReportType } from "../types/meters";
import { FaTachometerAlt } from "react-icons/fa";
import "./PagesStyles.css";
import { MeterRecordsTable } from "../components/meters/MeterRecordsTable";

interface ModalConfig {
  isOpen: boolean;
  title: string;
  message: string;
  type: "confirm" | "alert";
}

export const Meters = () => {
  const initialForm = { apartment: 201, water: 0, gas: 0 };

  const [activeTab, setActiveTab] = useState<"register" | "history">(
    "register",
  );
  const [meters, setMeters] = useState<MetersType[]>([]);
  const [reportData, setReportData] = useState<MeterReportType[]>([]);
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState("05");
  const [year, setYear] = useState("2026");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    isOpen: false,
    title: "",
    message: "",
    type: "alert",
  });

  const fetchMeters = async () => {
    const response = await getMeters();
    setMeters(response);
  };

  const fetchReport = async () => {
    setLoading(true);
    try {
      const data = await getConsumptionReport(month, year);
      setReportData(data);
    } catch (error) {
      console.error("Erro ao carregar relatório", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeters();
  }, []);
  useEffect(() => {
    fetchReport();
  }, [month, year]);

  // Função para abrir para NOVA medição
  const handleOpenCreate = () => {
    setEditingMeterId(null);
    setFormData(initialForm);
    setIsFormModalOpen(true);
  };

  // Função para abrir para EDIÇÃO
  const handleOpenEdit = (meter: MetersType) => {
    handleEdit(meter); // Preenche o formData
    setIsFormModalOpen(true);
  };

  // Handler de submissão que fecha o modal
  const onSubmitWithClose = async (e: React.FormEvent<HTMLFormElement>) => {
    const success = await handleSubmit(e);

    if (success) {
      setIsFormModalOpen(false);
    }
  };

  const {
    formData,
    setFormData,
    editingMeterId,
    setEditingMeterId,
    handleChange,
    handleEdit,
    handleSubmit,
    deleteRequest,
    handleDelete,
  } = useMeterForm({
    initialForm,
    fetchMeters,
    setModalConfig,
  });

  return (
    <>
      {/* Modal de Alerta/Confirmação (Exclusão) */}
      <Modal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onConfirm={handleDelete}
      />

      {/* MODAL DO FORMULÁRIO (Acionado por Nova Medição ou Editar) */}
      {isFormModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content form-modal">
            <h2 className="modal-title">
              {editingMeterId ? "Editar Medição" : "Nova Medição"}
            </h2>
            <button
              className="close-x"
              onClick={() => setIsFormModalOpen(false)}
            >
              &times;
            </button>

            <MetersForm
              formData={formData}
              handleChange={handleChange}
              handleSubmit={onSubmitWithClose}
              editingMeterId={editingMeterId}
            />
          </div>
        </div>
      )}

      <div className="main-container">
        <div className="tabs-header">
          <header className="pages-header">
            <h1>Gestão de Medidores</h1>
            <button onClick={handleOpenCreate} className="btn-new">
              <FaTachometerAlt /> Nova Medição
            </button>
          </header>

          <nav className="tabs-nav">
            <button
              className={activeTab === "register" ? "active" : ""}
              onClick={() => setActiveTab("register")}
            >
              Registro de Medições
            </button>
            <button
              className={activeTab === "history" ? "active" : ""}
              onClick={() => setActiveTab("history")}
            >
              Visualizar Medições
            </button>
          </nav>
        </div>

        <div className="tab-content">
          {activeTab === "register" ? (
            <section className="animate-in">
              <MeterRecordsTable
                meters={meters}
                onEdit={handleOpenEdit}
                onDelete={deleteRequest}
              />
            </section>
          ) : (
            <section className="animate-in">
              <div className="meters-page">
                <div className="report-header">
                  <h2>Métricas de Consumo</h2>
                  <FilterBar
                    month={month}
                    setMonth={setMonth}
                    year={year}
                    setYear={setYear}
                  />
                </div>
                <MeterTable data={reportData} loading={loading} />
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
};

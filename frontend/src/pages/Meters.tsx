import { useState } from "react";
import { MetersForm } from "../components/meters/MetersForm";
import { MeterTable } from "../components/meters/MeterTable";
import { Modal } from "../components/ui/Modal";
import { useMeters } from "../hooks/useMeters";
import type { MetersType } from "../types/meters";
import { FaTachometerAlt } from "react-icons/fa";
import { MeterRecordsTable } from "../components/meters/MeterRecordsTable";
import "./PagesStyles.css";

interface ModalConfig {
  isOpen: boolean;
  title: string;
  message: string;
  type: "confirm" | "alert";
}

export const Meters = () => {
  const [activeTab, setActiveTab] = useState<"register" | "history">(
    "register",
  );
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    isOpen: false,
    title: "",
    message: "",
    type: "alert",
  });

  const {
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
  } = useMeters({ setModalConfig });

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
              editingMeterId={editingMeterId}
              onSave={async () => {
                const success = await handleSubmit();
                if (success) {
                  setIsFormModalOpen(false);
                }
              }}
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
              className={`tab-btn ${activeTab === "register" ? "active" : ""}`}
              onClick={() => setActiveTab("register")}
            >
              Registro de Medições
            </button>
            <button
              className={`tab-btn ${activeTab === "history" ? "active" : ""}`}
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
                loading={loading}
              />
            </section>
          ) : (
            <section className="animate-in">
              <div className="meters-page">
                <MeterTable data={reportData} loading={loading} />
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
};

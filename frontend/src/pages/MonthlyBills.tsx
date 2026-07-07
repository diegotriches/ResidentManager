// Components
import { BillsForm } from "../components/monthly-bills/BillsForm";
import { UtilityBillsView } from "../components/monthly-bills/UtilityBillsView";
import { UtilityBillModal } from "../components/monthly-bills/UtilityBillModal";
import { BillsRecordsTable } from "../components/monthly-bills/BillsRecordTable";
import { Modal } from "../components/ui/Modal";
// Hooks
import { useState } from "react";
import { useMonthlyBills } from "../hooks/useMonthlyBills";
// Utils
import { formatCurrency } from "../utils/format";
// Icons
import { FaMoneyCheckAlt, FaPlusCircle } from "react-icons/fa";
import { FaDroplet, FaFireFlameCurved } from "react-icons/fa6";

interface ModalConfig {
  isOpen: boolean;
  title: string;
  message: string;
  type: "confirm" | "alert";
}

export const MonthlyBills = () => {
  // Configuração do Modal Global de Alertas/Confirmações
  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    isOpen: false,
    title: "",
    message: "",
    type: "alert",
  });

  // Estados locais para controlar a abertura dos modais de inserção/edição de dados
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isUtilityModalOpen, setIsUtilityModalOpen] = useState(false);

  // Consumo do Hook Unificado
  const {
    activeTab,
    setActiveTab,
    loading,

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
  } = useMonthlyBills({ setModalConfig });

  // --- CÁLCULOS DE RESUMO (Baseados no array correto: bills) ---
  const totalTotalValue = bills.reduce(
    (acc, bill) => acc + (bill.totalValue || 0),
    0,
  );
  const totalUnitValue = bills.reduce(
    (acc, bill) => acc + (bill.unitValue || 0),
    0,
  );

  // --- HANDLERS DE FLUXO DA TELA ---

  // Condomínio: Gatilho para abrir criando do zero
  const handleOpenCreate = () => {
    setFormData(initialForm);
    setBillId(null);
    setIsFormModalOpen(true);
  };

  // Condomínio: Gatilho para abrir editando uma linha
  const handleOpenEdit = (bill: any) => {
    handleEdit(bill);
    setIsFormModalOpen(true);
  };

  // Utilitários: Gatilho para abrir criando do zero
  const handleOpenCreateUtility = () => {
    setUtilityFormData(initialUtilityForm);
    setUtilityBillId(null);
    setIsUtilityModalOpen(true);
  };

  // Utilitários: Gatilho para abrir editando uma linha
  const handleOpenEditUtility = (bill: any) => {
    handleUtilityEdit(bill);
    setIsUtilityModalOpen(true);
  };

  return (
    <>
      {/* Modal do Sistema (Sucesso, Erro, Confirmação de Deleção) */}
      <Modal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onConfirm={handleDelete} // Conecta diretamente à função unificada de deleção
      />

      {/* Modal de Formulário: Água e Gás */}
      {isUtilityModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content form-modal">
            <h2 className="modal-title">
              {utilityBillId ? "Edição de Consumo" : "Novo Consumo"}
            </h2>
            <button
              className="close-x"
              onClick={() => {
                setIsUtilityModalOpen(false);
                setUtilityBillId(null);
              }}
            >
              &times;
            </button>

            <UtilityBillModal
              formData={utilityFormData}
              handleChange={handleUtilityChange}
              onSave={async () => {
                const success = await handleSubmit();
                if (success) {
                  setIsUtilityModalOpen(false);
                }
              }}
              editingUtilityBillId={utilityBillId}
            />
          </div>
        </div>
      )}

      <div className="main-container">
        <header className="pages-header">
          <h1>
            <FaMoneyCheckAlt /> Gastos Mensais
          </h1>
          {activeTab === "condo" ? (
            <div className="form-grid">
              Nova conta:
              <button onClick={handleOpenCreate} className="btn-new">
                <FaPlusCircle /> Condomínio
              </button>
            </div>
          ) : (
            <div className="form-grid">
              Nova conta:
              <button onClick={handleOpenCreateUtility} className="btn-new">
                <FaDroplet /> Água <FaFireFlameCurved /> Gás
              </button>
            </div>
          )}
        </header>

        {/* Navegação entre Abas */}
        <nav className="tabs-nav">
          <button
            className={`tab-btn ${activeTab === "condo" ? "active" : ""}`}
            onClick={() => setActiveTab("condo")}
          >
            Contas do Condomínio
          </button>
          <button
            className={`tab-btn ${activeTab === "utilities" ? "active" : ""}`}
            onClick={() => setActiveTab("utilities")}
          >
            Consumos (Água e Gás)
          </button>
        </nav>

        {/* Conteúdo Renderizado Condicionalmente */}
        <div className="tab-content">
          {loading ? (
            <p>Carregando registros...</p>
          ) : activeTab === "condo" ? (
            <>
              {bills.length > 0 ? (
                <>
                  <div className="summary-cards">
                    <div className="card">
                      <span>Total das Contas</span>
                      <strong>{formatCurrency(totalTotalValue)}</strong>
                    </div>
                    <div className="card">
                      <span>Soma por Unidade (Rateio)</span>
                      <strong>{formatCurrency(totalUnitValue)}</strong>
                    </div>
                  </div>

                  <BillsRecordsTable
                    bills={bills}
                    handleOpenEdit={handleOpenEdit}
                    deleteRequest={deleteRequest}
                  />
                </>
              ) : (
                <p>
                  Nenhuma conta de condomínio cadastrada para a data
                  selecionada.
                </p>
              )}
            </>
          ) : (
            <UtilityBillsView
              bills={utilityBills}
              handleOpenEdit={handleOpenEditUtility}
              deleteRequest={deleteRequest}
            />
          )}
        </div>

        {/* Modal de Formulário: Condomínio */}
        {isFormModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content form-modal">
              <button
                className="close-x"
                onClick={() => {
                  setIsFormModalOpen(false);
                  setBillId(null);
                  setFormData(initialForm);
                }}
              >
                &times;
              </button>
              <h2 className="modal-title">
                {billId ? "Editar Conta" : "Nova Conta"}
              </h2>
              <BillsForm
                formData={formData}
                handleChange={handleChange}
                onSave={async () => {
                  const success = await handleSubmit();
                  if (success) {
                    setIsFormModalOpen(false);
                  }
                }}
                editingBillId={billId}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

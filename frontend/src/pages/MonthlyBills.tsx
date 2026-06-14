// Components
import { BillsForm } from "../components/monthly-bills/BillsForm";
import { UtilityBillsView } from "../components/monthly-bills/UtilityBillsView";
import { UtilityBillModal } from "../components/monthly-bills/UtilityBillModal";
import { BillsRecordsTable } from "../components/monthly-bills/BillsRecordTable";
import { Modal } from "../components/ui/Modal";
// Hooks
import { useState } from "react";
import { useBillForm } from "../hooks/useBillForm";
import { useUtilityBills } from "../hooks/useUtilityBills";
// Types
import type { BillsType } from "../types/bills";
import type { UtilityBillType } from "../types/utilityBills";
// Utils
import { formatCurrency } from "../utils/format";
// Icons
import { FaMoneyCheckAlt } from "react-icons/fa";

interface ModalConfig {
  isOpen: boolean;
  title: string;
  message: string;
  type: "confirm" | "alert";
}

export const MonthlyBills = () => {
  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    isOpen: false,
    title: "",
    message: "",
    type: "alert",
  });
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isUtilityModalOpen, setIsUtilityModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"condo" | "utilities">("condo");

  const {
    initialForm,
    bills,
    formData,
    setFormData,
    editingBillId,
    setEditingBillId,
    handleChange,
    handleEdit,
    handleSubmit,
    handleDelete,
    deleteRequest,
  } = useBillForm({ setModalConfig });

  const {
    bills: utilityBills,
    formData: utilityFormData,
    handleSubmit: handleUtilitySubmit,
    handleChange: handleChangeUtility,
    handleEdit: handleEditUtility,
    handleDelete: handleDeleteUtility,
    deleteRequest: deleteUtilityRequest,
  } = useUtilityBills({ setModalConfig });

  const totalTotalValue = bills.reduce(
    (acc, bill) => acc + (bill.totalValue || 0),
    0,
  );
  const totalUnitValue = bills.reduce(
    (acc, bill) => acc + (bill.unitValue || 0),
    0,
  );

  // Função para confirmar qual página esta para excluir
  const handleConfirmAction = () => {
    if (activeTab === "condo") {
      handleDelete();
    } else {
      handleDeleteUtility();
    }
  };

  // Função para abrir para NOVA medição
  const handleOpenCreate = () => {
    setEditingBillId(null);
    setFormData(initialForm);
    setIsFormModalOpen(true);
  };

  // Função para abrir para EDIÇÃO de contas do condomínio
  const handleOpenEdit = (bill: BillsType) => {
    handleEdit(bill); // Carrega os dados antigos no formulário do hook
    setIsFormModalOpen(true); // Força o modal visual a aparecer na tela
  };

  // Função para abrir para EDIÇÃO de contas de água/gás
  const openEditUtility = (bill: UtilityBillType) => {
    handleEditUtility(bill); // Carrega os dados antigos no formulário do hook
    setIsUtilityModalOpen(true); // Força o modal visual a aparecer na tela
  };

  const onSubmitWithClose = async (e: React.FormEvent<HTMLFormElement>) => {
    const success = await handleSubmit(e);

    if (success) {
      setIsFormModalOpen(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onConfirm={handleConfirmAction}
      />

      {isUtilityModalOpen && (
        <UtilityBillModal
          formData={utilityFormData}
          handleChange={handleChangeUtility}
          onClose={() => setIsUtilityModalOpen(false)}
          onSave={async () => {
            const success = await handleUtilitySubmit(); // Executa o submit e aguarda o banco
            if (success) {
              setIsUtilityModalOpen(false); // Só fecha o modal se a operação deu certo
            }
          }}
        />
      )}

      <div className="main-container">
        <header>
          <h1>Gestão de Contas Mensais</h1>
          <div
            className="header-actions"
            style={{ display: "flex", gap: "10px" }}
          >
            {/* Botão de Contas do Condomínio */}
            <button onClick={handleOpenCreate} className="btn-new">
              <FaMoneyCheckAlt /> Nova Conta
            </button>

            {/* Botão de Água e Gás unificado no cabeçalho */}
            <button
              onClick={() => setIsUtilityModalOpen(true)}
              className="btn-new"
            >
              <FaMoneyCheckAlt /> Lançar Água/Gás
            </button>
          </div>
        </header>

        <div className="tabs-nav">
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
        </div>

        {/* RENDERIZAÇÃO CONDICIONAL DAS ABAS */}
        <div className="tab-content">
          {activeTab === "condo" ? (
            <>
              {/* Seção de Resumo para Contas do Condomínio */}
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

              {/* Tabela de Registros */}
              <BillsRecordsTable
                bills={bills}
                handleOpenEdit={handleOpenEdit}
                deleteRequest={deleteRequest}
              />
            </>
          ) : (
            <UtilityBillsView
              bills={utilityBills}
              handleOpenEdit={openEditUtility}
              deleteRequest={deleteUtilityRequest}
            />
          )}
        </div>

        {/* Modal de Formulário (Apenas para CondoBills) */}
        {isFormModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content form-modal">
              <button
                className="close-x"
                onClick={() => setIsFormModalOpen(false)}
              >
                X
              </button>
              <h2 className="modal-title">
                {editingBillId ? "Editar Conta" : "Nova Conta"}
              </h2>
              <BillsForm
                formData={formData}
                handleChange={handleChange}
                handleSubmit={onSubmitWithClose}
                editingBillId={editingBillId}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

import { useState, useEffect } from "react";
import { BillsForm } from "../components/monthly-bills/BillsForm";
import { UtilityBillsView } from "../components/monthly-bills/UtilityBillsView";
import { UtilityBillModal } from "../components/monthly-bills/UtilityBillModal";
import { Modal } from "../components/ui/Modal";
import { getBills } from "../services/billsService";
import { useBillForm } from "../hooks/useBillForm";
import { useFilter } from "../components/context/FilterContext";
import type { BillsType } from "../types/bills";
import { formatCurrency } from "../utils/format";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { BillsRecordsTable } from "../components/monthly-bills/BillsRecordTable";

interface ModalConfig {
  isOpen: boolean;
  title: string;
  message: string;
  type: "confirm" | "alert";
}

export const MonthlyBills = () => {
  const [bills, setBills] = useState<BillsType[]>([]);
  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    isOpen: false,
    title: "",
    message: "",
    type: "alert",
  });
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isUtilityModalOpen, setIsUtilityModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"condo" | "utilities">("condo");

  const { month, year } = useFilter();
  const initialForm = { bill: "", totalValue: 0, unitValue: 0 };
  const totalTotalValue = bills.reduce(
    (acc, bill) => acc + (bill.totalValue || 0),
    0,
  );
  const totalUnitValue = bills.reduce(
    (acc, bill) => acc + (bill.unitValue || 0),
    0,
  );

  const fetchBills = async () => {
    const response = await getBills(month, year);
    setBills(response);
  };

  useEffect(() => {
    fetchBills();
  }, [month, year]);

  // Função para abrir para NOVA medição
  const handleOpenCreate = () => {
    setEditingBillId(null);
    setFormData(initialForm);
    setIsFormModalOpen(true);
  };

  // Função para abrir para EDIÇÃO
  const handleOpenEdit = (bill: BillsType) => {
    handleEdit(bill);
    setIsFormModalOpen(true);
  };

  const onSubmitWithClose = async (e: React.FormEvent<HTMLFormElement>) => {
    const success = await handleSubmit(e);

    if (success) {
      setIsFormModalOpen(false);
    }
  };

  const handleSaveUtilityBill = async (newBill: any) => {
    try {
      await fetch("/api/utility-bills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newBill, month, year }),
      });
      // Como a lista está dentro do UtilityBillsView,
      // você precisará de uma forma de avisar o componente para atualizar
      // ou mover a lógica de busca para cá.
      setIsUtilityModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar fatura:", error);
    }
  };

  // INSTANCIANDO O HOOK
  const {
    formData,
    setFormData,
    editingBillId,
    setEditingBillId,
    handleChange,
    handleEdit,
    handleSubmit,
    deleteRequest,
    handleDelete,
  } = useBillForm({ initialForm, fetchBills, setModalConfig });

  return (
    <>
      <Modal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onConfirm={handleDelete}
      />

      {isUtilityModalOpen && (
        <UtilityBillModal
          onClose={() => setIsUtilityModalOpen(false)}
          onSave={handleSaveUtilityBill}
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
              style={{ backgroundColor: "#27ae60" }}
            >
              <FaMoneyCheckAlt /> Lançar Água/Gás
            </button>
          </div>
        </header>

        <div
          className="tabs-navigation"
          style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
        >
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
            <UtilityBillsView />
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

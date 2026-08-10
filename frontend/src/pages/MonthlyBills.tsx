import { useState } from "react";
// Components
import { BillsFormModal } from "../components/monthly-bills/BillsFormModal";
import { UtilityBillsView } from "../components/monthly-bills/UtilityBillsView";
import { WaterBillModal } from "../components/monthly-bills/WaterBillModal";
import { GasBillModal } from "../components/monthly-bills/GasBillModal";
import { BillsRecordsTable } from "../components/monthly-bills/BillsRecordTable";
import { Modal } from "../components/ui/Modal";
// Hooks
import { useBills } from "../hooks/useBills";
import { useUtilityBills } from "../hooks/useUtilityBills";
import { useApartments } from "../hooks/useApartments";
// Utils
import { formatCurrency } from "../utils/format";
// Icons
import { FaMoneyCheckAlt, FaPlusCircle, FaLayerGroup } from "react-icons/fa";
import { FaDroplet, FaFireFlameCurved } from "react-icons/fa6";
// UI
import * as Dropdown from "@radix-ui/react-dropdown-menu";

export interface ModalConfig {
  isOpen: boolean;
  title: string;
  message: string;
  type: "confirm" | "alert";
  onConfirm?: () => void;
}

export const MonthlyBills = () => {
  const [activeTab, setActiveTab] = useState<"condo" | "utilities">("condo");
  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    isOpen: false,
    title: "",
    message: "",
    type: "alert",
  });

  const {
    loading,
    bills,
    billId,
    isFormModalOpen,
    setIsFormModalOpen,
    formData,
    handleChange,
    handleEdit,
    handleSubmit,
    deleteRequest,
    resetForm,
  } = useBills({ setModalConfig });

  const {
    utilityBills,
    loading: loadingUtility,
    utilityBillId,
    isFormModalOpen: isUtilityModalOpen,
    setIsFormModalOpen: setIsUtilityModalOpen,
    formData: utilityFormData,
    setFormData: setUtilityFormData,
    handleChange: handleUtilityChange,
    handleEdit: handleUtilityEdit,
    handleSubmit: handleUtilitySubmit,
    deleteRequest: deleteUtilityRequest,
    resetForm: resetUtilityForm,
  } = useUtilityBills({ setModalConfig });

  const { totalApartments } = useApartments({ setModalConfig });

  // --- CÁLCULOS DE RESUMO (Baseados no array correto: bills) ---
  const sumTotalValue = bills.reduce(
    (acc, bill) => acc + (bill.totalValue || 0),
    0,
  );

  // --- HANDLERS DE FLUXO DA TELA ---

  // Condomínio: Gatilho para abrir criando do zero
  const handleOpenCreate = () => {
    resetForm();
    setIsFormModalOpen(true);
  };

  // Utilitários: Gatilho para abrir criando do zero
  const handleOpenCreateUtility = (type: "water" | "gas") => {
    resetUtilityForm();
    setUtilityFormData((prev) => ({ ...prev, type }));
    setIsUtilityModalOpen(true);
  };

  const isLoading = activeTab === "condo" ? loading : loadingUtility;

  return (
    <>
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
                resetUtilityForm();
              }}
            >
              &times;
            </button>

            {utilityFormData.type === "water" ? (
              <WaterBillModal
                formData={utilityFormData}
                handleChange={handleUtilityChange}
                onSave={async () => {
                  const success = await handleUtilitySubmit();
                  if (success) {
                    setIsUtilityModalOpen(false);
                  }
                }}
                editingUtilityBillId={utilityBillId}
              />
            ) : (
              <GasBillModal
                formData={utilityFormData}
                handleChange={handleUtilityChange}
                onSave={async () => {
                  const success = await handleUtilitySubmit();
                  if (success) {
                    setIsUtilityModalOpen(false);
                  }
                }}
                editingUtilityBillId={utilityBillId}
              />
            )}
          </div>
        </div>
      )}

      {isFormModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content form-modal">
            <button
              className="close-x"
              onClick={() => {
                setIsFormModalOpen(false);
                resetForm();
              }}
            >
              &times;
            </button>
            <h2 className="modal-title">
              {billId ? "Editar Conta" : "Nova Conta"}
            </h2>
            <BillsFormModal
              formData={formData}
              handleChange={handleChange}
              onSave={async () => {
                const success = await handleSubmit();
                if (success) setIsFormModalOpen(false);
              }}
              editingBillId={billId}
              setModalConfig={setModalConfig}
            />
          </div>
        </div>
      )}

      <div className="main-container">
        <header className="pages-header">
          <h1>
            <FaMoneyCheckAlt /> Gastos Mensais
          </h1>
          <div className="form-grid">
            <Dropdown.Root>
              <Dropdown.Trigger asChild>
                <button className="btn-new">
                  <FaPlusCircle /> Nova Conta
                </button>
              </Dropdown.Trigger>

              <Dropdown.Portal>
                <Dropdown.Content className="dropdown-content" sideOffset={5}>
                  <Dropdown.Item
                    className="dropdown-item"
                    onSelect={handleOpenCreate}
                  >
                    <FaLayerGroup />
                    Condomínio
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="dropdown-item"
                    onSelect={() => {
                      handleOpenCreateUtility("water");
                    }}
                  >
                    <FaDroplet /> Água
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="dropdown-item"
                    onSelect={() => {
                      handleOpenCreateUtility("gas");
                    }}
                  >
                    <FaFireFlameCurved /> Gás
                  </Dropdown.Item>
                </Dropdown.Content>
              </Dropdown.Portal>
            </Dropdown.Root>
          </div>
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
          {isLoading ? (
            <p>Carregando registros...</p>
          ) : activeTab === "condo" ? (
            <>
              {bills.length > 0 ? (
                <>
                  <div className="summary-cards">
                    <div className="card">
                      <span>Total das Contas</span>
                      <strong>{formatCurrency(sumTotalValue)}</strong>
                    </div>
                    <div className="card">
                      <span>Soma por Unidade (Rateio)</span>
                      <strong>
                        {formatCurrency(
                          totalApartments > 0
                            ? sumTotalValue / totalApartments
                            : 0,
                        )}
                      </strong>
                    </div>
                  </div>

                  <BillsRecordsTable
                    bills={bills}
                    handleOpenEdit={handleEdit}
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
              handleOpenEdit={handleUtilityEdit}
              deleteRequest={deleteUtilityRequest}
            />
          )}
        </div>
      </div>

      {/* Modal do Sistema (Sucesso, Erro, Confirmação de Deleção) */}
      <Modal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onConfirm={modalConfig.onConfirm}
      />
    </>
  );
};

import { useState, useEffect } from "react";
import { BillsForm } from "../components/monthly-bills/BillsForm";
import { Modal } from "../components/ui/Modal";
import { getBills } from "../services/billsService";
import { useBillForm } from "../hooks/useBillForm";
import type { BillsType } from "../types/bills";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { BillsRecordsTable } from "../components/monthly-bills/BillsRecordTable";

interface ModalConfig {
  isOpen: boolean;
  title: string;
  message: string;
  type: "confirm" | "alert";
}

export const MonthlyBills = () => {
  const initialForm = { bill: "", totalValue: 0, unitValue: 0 };
  const [bills, setBills] = useState<BillsType[]>([]);
  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    isOpen: false,
    title: "",
    message: "",
    type: "alert",
  });
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const fetchBills = async () => {
    const response = await getBills();
    setBills(response);
  };

  useEffect(() => {
    fetchBills();
  }, []);

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
      <div className="main-container">
        <header>
          <h1>Gestão de Contas</h1>
          <button onClick={handleOpenCreate} className="btn-new">
            <FaMoneyCheckAlt /> Nova Conta
          </button>
        </header>

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

        <BillsRecordsTable
          bills={bills}
          handleOpenEdit={handleOpenEdit}
          deleteRequest={deleteRequest}
        />
      </div>
    </>
  );
};

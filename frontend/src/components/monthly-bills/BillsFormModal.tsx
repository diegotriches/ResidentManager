import { FaPencilAlt, FaPlusCircle } from "react-icons/fa";
import type { BillsFormData } from "../../types/bills";
import { months } from "../../utils/constants";
import { BillsFormCategories } from "./BillsFormCategories";
import { useBillCategories } from "../../hooks/useBillCategories";
import type { ModalConfig } from "../../pages/MonthlyBills";

interface BillsFormProps {
  formData: BillsFormData;
  onSave: (data: BillsFormData) => void;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  editingBillId?: number | null;
  setModalConfig: React.Dispatch<React.SetStateAction<ModalConfig>>;
}

export const BillsFormModal = ({
  onSave,
  formData,
  handleChange,
  editingBillId,
  setModalConfig,
}: BillsFormProps) => {
  const handleSave = () => {
    onSave({ ...formData });
  };

  const {
    loading,
    isFormModalOpen,
    setIsFormModalOpen,
    categories,
    formData: categoryFormData,
    categoryId,
    handleChange: handleCategoryChange,
    handleEdit,
    handleSubmit,
    deleteRequest,
    resetForm,
  } = useBillCategories({ setModalConfig });

  const handleOpenCreate = () => {
    resetForm();
    setIsFormModalOpen(true);
  };

  return (
    <>
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
              {categoryId ? "Editar Categoria" : "Nova Categoria"}
            </h2>

            <BillsFormCategories
              loading={loading}
              categories={categories}
              formData={categoryFormData}
              categoryId={categoryId}
              onChange={handleCategoryChange}
              onSave={async () => {
                const success = await handleSubmit();
                if (success) setIsFormModalOpen(false);
              }}
              onEdit={handleEdit}
              onDelete={deleteRequest}
            />
          </div>
        </div>
      )}

      <div className="form-wrapper">
        <div className="form-grid">
          <div className="form-field">
            <label>Data da medição:</label>
            <span>
              {months.find((m) => m.value === formData.month)?.label}/
              {formData.year}
            </span>
          </div>

          <div className="form-field">
            <button onClick={handleOpenCreate} className="btn-new">
              Ver Categorias
            </button>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-field">
            <label>Conta</label>
            <input
              name="bill"
              value={formData.bill}
              onChange={handleChange}
              placeholder="Ex.: Limpeza"
              required
            />
          </div>

          <div className="form-field">
            <label>Valor Total</label>
            <input
              type="number"
              step="0.01"
              name="totalValue"
              value={formData.totalValue || ""}
              onChange={handleChange}
              placeholder="R$ 0,00"
              required
            />
          </div>
        </div>

        <div className="modal-btns">
          <button onClick={handleSave} className="btn-save">
            {!editingBillId ? (
              <>
                <FaPlusCircle /> Cadastrar
              </>
            ) : (
              <>
                <FaPencilAlt /> Editar
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

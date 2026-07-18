import { FaPencilAlt, FaPlusCircle } from "react-icons/fa";
import type { BillsFormData } from "../../types/bills";
import { months } from "../../utils/constants";

interface BillsFormProps {
  formData: BillsFormData;
  onSave: (data: BillsFormData) => void;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  editingBillId?: number | null;
}

export const BillsForm = ({
  onSave,
  formData,
  handleChange,
  editingBillId,
}: BillsFormProps) => {
  const handleSave = () => {
    onSave({ ...formData });
  };

  return (
    <div className="form-wrapper">
      <div className="form-field">
        <label>Data da medição:</label>
        <span>
          {months.find((m) => m.value === formData.month)?.label}/
          {formData.year}
        </span>
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
  );
};

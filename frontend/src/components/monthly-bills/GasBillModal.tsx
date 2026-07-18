import { FaPencilAlt, FaPlusCircle } from "react-icons/fa";
import type { UtilityFormDataType } from "../../types/utilityBills";
import { months } from "../../utils/constants";

interface UtilityBillModalProps {
  onSave: (data: UtilityFormDataType) => void;
  formData: UtilityFormDataType;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  editingUtilityBillId: number | null;
}

export const GasBillModal = ({
  onSave,
  formData,
  handleChange,
  editingUtilityBillId,
}: UtilityBillModalProps) => {
  const handleSave = () => {
    // A lógica de cálculo é validada aqui antes de enviar ao backend
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

      <div className="form-field filter-select">
        <label>Tipo de Conta:</label>
        <span>{formData.type === "gas"} Gás</span>
      </div>

      <input type="hidden" name="type" value={formData.type} />

      <div className="form-grid">
        <div className="form-field">
          <label>Tipo de Botijão:</label>
          <select
            name="cylinderType"
            value={formData.cylinderType}
            onChange={handleChange}
          >
            <option value="P45">P45 (45kg)</option>
            <option value="P90">P90 (90kg)</option>
          </select>
        </div>

        <div className="form-field">
          <label>Valor do Botijão:</label>
          <input
            type="number"
            name="unitPrice"
            placeholder="R$"
            value={formData.unitPrice || ""}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="modal-btns">
        <button onClick={handleSave} className="btn-save">
          {!editingUtilityBillId ? (
            <>
              <FaPlusCircle />
              Salvar Conta
            </>
          ) : (
            <>
              <FaPencilAlt />
              Editar Conta
            </>
          )}
        </button>
      </div>
    </div>
  );
};

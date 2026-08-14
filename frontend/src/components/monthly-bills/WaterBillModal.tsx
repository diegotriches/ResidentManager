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

export const WaterBillModal = ({
  onSave,
  formData,
  handleChange,
  editingUtilityBillId,
}: UtilityBillModalProps) => {
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
        <div className="form-field filter-select">
          <label>Tipo de Conta:</label>
          <span>{formData.type === "water"} Água</span>
        </div>

        <input type="hidden" name="type" value={formData.type} />

        <div className="form-field">
          <label>Consumo:</label>
          <input
            type="number"
            name="totalConsumption"
            placeholder="m³"
            value={formData.totalConsumption || ""}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label>Valor total:</label>
          <input
            type="number"
            name="consumptionValue"
            placeholder="R$"
            value={formData.consumptionValue || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-field">
          <label>Total em taxas:</label>
          <input
            type="number"
            name="taxesValue"
            placeholder="R$"
            value={formData.taxesValue || ""}
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

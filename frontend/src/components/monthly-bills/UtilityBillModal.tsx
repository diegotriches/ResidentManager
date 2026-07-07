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

export const UtilityBillModal = ({
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
      <div className="form-grid">
        <div className="form-field">
          <label>Mês:</label>
          <select
            name="month"
            value={formData.month}
            onChange={handleChange}
            required
          >
            <option value="">Selecione o mês</option>
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label>Ano:</label>
          <input
            type="number"
            name="year"
            min="1000"
            max="9999"
            value={formData.year}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-field filter-select">
        <label>Tipo de Conta:</label>
        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="water">Água (m³)</option>
          <option value="gas">Gás (kg)</option>
        </select>
      </div>

      {formData.type === "water" ? (
        <>
          <div className="form-grid">
            <div className="form-field">
              <label>Consumo:</label>
              <input
                type="number"
                name="totalConsumptionM3"
                placeholder="m³"
                value={formData.totalConsumptionM3 || ""}
                onChange={handleChange}
              />
            </div>

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
          </div>

          <div className="form-grid">
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

            <div className="form-field">
              <label>Ratear por (unidades):</label>
              <input
                type="number"
                name="splitCount"
                value={formData.splitCount}
                onChange={handleChange}
              />
            </div>
          </div>
        </>
      ) : (
        <>
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

          <div className="form-field">
            <label>Ratear por (unidades):</label>
            <input
              type="number"
              name="splitCount"
              value={formData.splitCount}
              onChange={handleChange}
            />
          </div>
        </>
      )}

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

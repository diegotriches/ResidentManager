import type { UtilityFormDataType } from "../../types/utilityBills";
import { months } from "../../utils/constants";

interface UtilityBillModalProps {
  onClose: () => void;
  onSave: (data: UtilityFormDataType) => void;
  formData: UtilityFormDataType;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
}

export const UtilityBillModal = ({
  onClose,
  onSave,
  formData,
  handleChange,
}: UtilityBillModalProps) => {
  const handleSave = () => {
    // A lógica de cálculo é validada aqui antes de enviar ao backend
    onSave({ ...formData });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Cadastrar Fatura de Concessionária</h2>

        <label>Tipo de Conta:</label>
        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="water">Água (m³)</option>
          <option value="gas">Gás (kg)</option>
        </select>

        <label>Mês:</label>
        <select name="month" value={formData.month} onChange={handleChange}>
          <option value="">Selecione o mês</option>
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>

        <label>Ano:</label>
        <input
          type="number"
          name="year"
          min="1000"
          max="9999"
          value={formData.year}
          onChange={handleChange}
        />

        {formData.type === "water" ? (
          <div className="form-section">
            <label>Consumo:</label>
            <input
              type="number"
              name="totalConsumptionM3"
              placeholder="m³"
              value={formData.totalConsumptionM3 || ""}
              onChange={handleChange}
            />
            <label>Valor total:</label>
            <input
              type="number"
              name="consumptionValue"
              placeholder="R$"
              value={formData.consumptionValue || ""}
              onChange={handleChange}
            />
            <label>Total em taxas:</label>
            <input
              type="number"
              name="taxesValue"
              placeholder="R$"
              value={formData.taxesValue || ""}
              onChange={handleChange}
            />
          </div>
        ) : (
          <div className="form-section">
            <label>Tipo de Botijão:</label>
            <select
              name="cylinderType"
              value={formData.cylinderType}
              onChange={handleChange}
            >
              <option value="P45">P45 (45kg)</option>
              <option value="P90">P90 (90kg)</option>
            </select>
            <label>Valor do Botijão:</label>
            <input
              type="number"
              name="unitPrice"
              placeholder="R$"
              value={formData.unitPrice || ""}
              onChange={handleChange}
            />
          </div>
        )}

        <div
          className="config-box"
          style={{ marginTop: "15px", padding: "10px", background: "#f0f0f0" }}
        >
          <label>Ratear por (unidades):</label>
          <input
            type="number"
            name="splitCount"
            value={formData.splitCount}
            onChange={handleChange}
          />
        </div>

        <div className="modal-actions">
          <button onClick={onClose}>Cancelar</button>
          <button onClick={handleSave} className="btn-save">
            Salvar Conta
          </button>
        </div>
      </div>
    </div>
  );
};

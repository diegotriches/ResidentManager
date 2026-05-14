import { useState } from "react";

// 1. Definição da interface para os dados do formulário
interface UtilityFormData {
  type: 'water' | 'gas';
  total_consumption_m3: number;
  consumption_value: number;
  taxes_value: number;
  cylinder_type: string;
  unit_price: number;
  multiplier_factor: number;
  split_count: number;
}

// 2. Definição das props do componente
interface UtilityBillModalProps {
  onClose: () => void;
  onSave: (data: UtilityFormData) => void;
}

export const UtilityBillModal = ({ onClose, onSave }: UtilityBillModalProps) => {
  const [type, setType] = useState<"water" | "gas">("water");
  const [formData, setFormData] = useState<Omit<UtilityFormData, 'type'>>({
    total_consumption_m3: 0,
    consumption_value: 0,
    taxes_value: 0,
    cylinder_type: "P45",
    unit_price: 0,
    multiplier_factor: 2.25,
    split_count: 21,
  });

  const handleSave = () => {
    // A lógica de cálculo é validada aqui antes de enviar ao backend
    onSave({ ...formData, type });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Cadastrar Fatura de Concessionária</h2>

        <label>Tipo de Conta:</label>
        <select value={type} onChange={(e) => setType(e.target.value as any)}>
          <option value="water">Água (m³)</option>
          <option value="gas">Gás (kg)</option>
        </select>

        {type === "water" ? (
          <div className="form-section">
            <input
              type="number"
              placeholder="Consumo Total (m³)"
              value={formData.total_consumption_m3 || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  total_consumption_m3: Number(e.target.value),
                })
              }
            />
            <input
              type="number"
              placeholder="Valor do Consumo (R$)"
              value={formData.consumption_value || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  consumption_value: Number(e.target.value),
                })
              }
            />
            <input
              type="number"
              placeholder="Valor das Taxas (R$)"
              value={formData.taxes_value || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  taxes_value: Number(e.target.value),
                })
              }
            />
          </div>
        ) : (
          <div className="form-section">
            <label>Tipo de Botijão:</label>
            <select
              value={formData.cylinder_type}
              onChange={(e) =>
                setFormData({ ...formData, cylinder_type: e.target.value })
              }
            >
              <option value="P20">P20 (20kg)</option>
              <option value="P45">P45 (45kg)</option>
              <option value="P90">P90 (90kg)</option>
            </select>
            <input
              type="number"
              placeholder="Valor Pago pelo Botijão (R$)"
              onChange={(e) =>
                setFormData({ ...formData, unit_price: Number(e.target.value) })
              }
            />
            <label>Fator de Correção:</label>
            <input
              type="number"
              step="0.01"
              value={formData.multiplier_factor}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  multiplier_factor: Number(e.target.value),
                })
              }
            />
          </div>
        )}

        <div
          className="config-box"
          style={{ marginTop: "15px", padding: "10px", background: "#f0f0f0" }}
        >
          <label>Ratear taxas por (unidades):</label>
          <input
            type="number"
            value={formData.split_count}
            onChange={(e) =>
              setFormData({ ...formData, split_count: Number(e.target.value) })
            }
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

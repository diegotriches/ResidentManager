import type { BillsType } from "../../types/bills";
import "../FormStyles.css";

interface BillsFormProps {
  formData: Partial<BillsType>;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  editingBillId?: number | null;
}

export const BillsForm: React.FC<BillsFormProps> = ({
  formData,
  handleSubmit,
  handleChange,
  editingBillId,
}) => {
  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-field">
          <label>Conta</label>
          <input
            name="bill"
            value={formData.bill}
            onChange={handleChange}
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
            required
          />
        </div>

        <div className="form-field">
          <label>Valor unitário</label>
          <input
            type="number"
            step="0.01"
            name="unitValue"
            value={formData.unitValue || ""}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className={`btn-submit ${editingBillId ? "editing" : ""}`}
        >
          {editingBillId ? "Salvar Medição" : "Cadastrar Medição"}
        </button>
      </form>
    </div>
  );
};

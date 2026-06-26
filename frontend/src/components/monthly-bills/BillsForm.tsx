import type { BillsType } from "../../types/bills";
import { months } from "../../utils/constants";

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
    <>
      <form onSubmit={handleSubmit} className="form-wrapper">
        <div className="form-grid">
          <div className="form-field">
            <label>Mês</label>
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
            <label>Ano</label>
            <input
              name="year"
              type="number"
              min="1000"
              max="9999"
              value={formData.year}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-field">
          <label>Conta</label>
          <input
            name="bill"
            value={formData.bill}
            onChange={handleChange}
            placeholder="Digite o nome da conta"
            required
          />
        </div>

        <div className="form-grid">
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
            <label>Valor Unitário</label>
            <input
              type="number"
              step="0.01"
              name="unitValue"
              value={formData.unitValue || ""}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className={`btn-submit ${editingBillId ? "editing" : ""}`}
        >
          {editingBillId ? "Salvar Medição" : "Cadastrar Medição"}
        </button>
      </form>
    </>
  );
};

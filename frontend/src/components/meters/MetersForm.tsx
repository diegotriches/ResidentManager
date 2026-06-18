import type { MetersType } from "../../types/meters";
import { months, apartments } from "../../utils/constants";

interface MetersFormProps {
  formData: Partial<MetersType>;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  editingMeterId?: number | null;
}

export const MetersForm: React.FC<MetersFormProps> = ({
  formData,
  handleSubmit,
  handleChange,
  editingMeterId,
}) => {
  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-field">
          <label>Mês:</label>
          <select name="month" value={formData.month} onChange={handleChange}>
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
          />
        </div>

        <div className="form-field">
          <label>Apartamento</label>
          <select
            name="apartment"
            value={formData.apartment}
            onChange={handleChange}
          >
            {apartments.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label>Medição de Água</label>
          <input
            type="number"
            name="water"
            value={formData.water}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label>Medição de Gás</label>
          <input
            type="number"
            name="gas"
            value={formData.gas}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className={`btn-submit ${editingMeterId ? "editing" : ""}`}
        >
          {editingMeterId ? "Salvar Medição" : "Cadastrar Medição"}
        </button>
      </form>
    </div>
  );
};

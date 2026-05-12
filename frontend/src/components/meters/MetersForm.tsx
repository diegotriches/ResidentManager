import type { MetersType } from "../../types/meters";
import "../FormStyles.css";

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
  const apartmentMeter = Array.from({ length: 7 }, (_, floorIndex) => {
    const floor = floorIndex + 2; // começa no andar 2
    return [1, 2, 3].map((apt) => Number(`${floor}0${apt}`));
  }).flat();

  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-field">
          <label>Apartamento</label>
          <select
            name="apartment"
            value={formData.apartment}
            onChange={handleChange}
          >
            {apartmentMeter.map((option) => (
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

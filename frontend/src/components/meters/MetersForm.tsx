import { FaPencilAlt, FaPlusCircle } from "react-icons/fa";
import { useApartmentContext } from "../../context/ApartmentContext";
import type { MeterFormData } from "../../types/meters";
import { months } from "../../utils/constants";

interface MetersFormProps {
  formData: MeterFormData;
  onSave: (data: MeterFormData) => void;
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  editingMeterId?: number | null;
}

export const MetersForm: React.FC<MetersFormProps> = ({
  formData,
  onSave,
  handleChange,
  editingMeterId,
}) => {
  const handleSave = () => {
    onSave({ ...formData });
  };

  const { apartments, loading } = useApartmentContext();

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

      <div className="form-field">
        <label>Apartamento</label>
        <select
          name="apartment"
          value={formData.apartment}
          onChange={handleChange}
          disabled={loading}
        >
          <option value="">
            {loading ? "Carregando unidades..." : "Selecione o apartamento"}
          </option>
          {!loading &&
            apartments.map((apt) => (
              <option key={apt.id} value={apt.id}>
                Apto {apt.number} {apt.ownerName ? `(${apt.ownerName})` : ""}
              </option>
            ))}
        </select>
      </div>

      <div className="form-grid">
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
      </div>

      <div className="modal-btns">
        <button onClick={handleSave} className="btn-save">
          {!editingMeterId ? (
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

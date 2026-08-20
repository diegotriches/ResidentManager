import { FaPencilAlt, FaPlusCircle } from "react-icons/fa";
import { useApartments } from "../../hooks/useApartments";
import type { MeterFormData } from "../../types/meters";
import { months } from "../../utils/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

  const { apartments, loading } = useApartments();

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
        <label>Apartamento</label>
        <select
          name="apartmentId"
          value={formData.apartmentId}
          onChange={handleChange}
          disabled={loading}
        >
          <option value="">
            {loading ? "Carregando unidades..." : "Selecione o apartamento"}
          </option>
          {!loading &&
            apartments.map((apt) => (
              <option key={apt.id} value={apt.id}>
                Apto {apt.apartment} {apt.ownerName ? `(${apt.ownerName})` : ""}
              </option>
            ))}
        </select>
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label>Medição de Água</label>
          <Input
            id="water"
            type="number"
            name="water"
            value={formData.water}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label>Medição de Gás</label>
          <Input
            id="gas"
            type="number"
            name="gas"
            value={formData.gas}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="modal-btns">
        <Button onClick={handleSave} className="btn-save">
          {!editingMeterId ? (
            <>
              <FaPlusCircle /> Cadastrar
            </>
          ) : (
            <>
              <FaPencilAlt /> Salvar
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

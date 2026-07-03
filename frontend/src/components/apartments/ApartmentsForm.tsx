import { FaPencilAlt, FaPlusCircle } from "react-icons/fa";
import type { ApartmentsData } from "../../types/apartments";

interface ApartmentsFormProps {
  formData: ApartmentsData;
  onSave: (data: ApartmentsData) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  apartmentId: number | null;
}

export const ApartmentsForm = ({
  onSave,
  formData,
  handleChange,
  apartmentId,
}: ApartmentsFormProps) => {
  const handleSave = () => {
    onSave({ ...formData });
  };

  return (
    <div className="form-wrapper">
      <div className="form-grid">
        <div className="form-field">
          <label>Número</label>
          <input
            name="number"
            type="number"
            value={formData.number}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label>Proprietário</label>
          <input
            name="ownerName"
            value={formData.ownerName}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="modal-btns">
        <button onClick={handleSave} className="btn-save">
          {!apartmentId ? (
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

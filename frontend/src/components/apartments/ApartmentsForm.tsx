import type { ApartmentsData } from "../../types/apartments";

interface ApartmentsFormProps {
  formData: ApartmentsData;
  onSave: (data: ApartmentsData) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ApartmentsForm = ({
  onSave,
  formData,
  handleChange,
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

      <div className="modal-actions">
        <button onClick={handleSave} className="btn-save">
          Cadastrar
        </button>
      </div>
    </div>
  );
};

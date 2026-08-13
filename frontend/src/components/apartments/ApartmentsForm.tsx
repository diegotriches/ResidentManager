import { FaPencilAlt, FaPlusCircle } from "react-icons/fa";
import type { ApartmentsData } from "../../types/apartments";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <label htmlFor="apartment" className="text-sm font-medium">
            Apartamento
          </label>
          <Input
            id="apartment"
            name="apartment"
            value={formData.apartment}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="ownerName" className="text-sm font-medium">
            Proprietário
          </label>
          <Input
            id="ownerName"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          {!apartmentId ? (
            <>
              <FaPlusCircle />
              Cadastrar
            </>
          ) : (
            <>
              <FaPencilAlt />
              Editar
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

import { FaPencilAlt, FaPlusCircle, FaTrashAlt } from "react-icons/fa";

interface Categories {
  id?: number;
  categoryName: string;
}

interface BillsFormCategoriesProps {
  loading: boolean;
  categories: Categories[];
  formData: Categories;
  categoryId: number | null;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  onSave: () => void;
  onEdit: (category: Categories) => void;
  onDelete: (id: number) => void;
}

export const BillsFormCategories = ({
  loading,
  categories,
  formData,
  categoryId,
  onChange,
  onSave,
  onEdit,
  onDelete,
}: BillsFormCategoriesProps) => {
  return (
    <div className="form-wrapper">
      <div className="form-field">
        <label>Nome da categoria:</label>
        <input
          name="categoryName"
          value={formData.categoryName}
          onChange={onChange}
          placeholder="Ex.: Limpeza"
          required
        />
      </div>

      <div className="modal-btns">
        <button onClick={onSave} className="btn-save">
          {!categoryId ? (
            <>
              <FaPlusCircle /> Cadastrar
            </>
          ) : (
            <>
              <FaPencilAlt /> Salvar Edição
            </>
          )}
        </button>
      </div>

      <div className="form-field">
        {loading ? (
          <p>Carregando registros...</p>
        ) : (
          categories.map((c) => (
            <div key={c.id ?? c.categoryName} className="category-item">
              <p>{c.categoryName}</p>
              <button
                type="button"
                className="btn-edit"
                onClick={() => onEdit(c)}
              >
                <FaPencilAlt /> Editar
              </button>
              <button
                type="button"
                className="btn-delete"
                onClick={() => c.id && onDelete(c.id)}
              >
                <FaTrashAlt /> Excluir
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

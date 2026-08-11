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

      <div className="category-container">
        <h4>Categorias</h4>
        <p>Selecione para mais opções:</p>
        <div className="categories-grid">
          {loading ? (
            <p>Carregando registros...</p>
          ) : (
            categories.map((c) => (
              <ul key={c.id ?? c.categoryName} className="category-item">
                <li>{c.categoryName}</li>
                <button
                  type="button"
                  className="category-edit"
                  onClick={() => onEdit(c)}
                >
                  <FaPencilAlt />
                </button>
                <button
                  type="button"
                  className="category-delete"
                  onClick={() => c.id && onDelete(c.id)}
                >
                  <FaTrashAlt />
                </button>
              </ul>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

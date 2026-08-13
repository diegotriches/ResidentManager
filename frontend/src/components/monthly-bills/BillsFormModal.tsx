import { FaPencilAlt, FaPlusCircle } from "react-icons/fa";
import type { BillsFormData } from "../../types/bills";
import { months } from "../../utils/constants";
import { BillsFormCategories } from "./BillsFormCategories";
import { useBillCategories } from "../../hooks/useBillCategories";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface BillsFormProps {
  formData: BillsFormData;
  onSave: (data: BillsFormData) => void;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  editingBillId?: number | null;
}

export const BillsFormModal = ({
  onSave,
  formData,
  handleChange,
  editingBillId,
}: BillsFormProps) => {
  const handleSave = () => {
    onSave({ ...formData });
  };

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null);

  const {
    loading,
    isFormModalOpen,
    setIsFormModalOpen,
    categories,
    formData: categoryFormData,
    categoryId,
    handleChange: handleCategoryChange,
    handleEdit,
    handleSubmit,
    handleDelete,
    resetForm,
  } = useBillCategories();

  const handleOpenCreate = () => {
    resetForm();
    setIsFormModalOpen(true);
  };

  return (
    <>
      {isFormModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content form-modal">
            <button
              className="close-x"
              onClick={() => {
                setIsFormModalOpen(false);
                resetForm();
              }}
            >
              &times;
            </button>
            <h2 className="modal-title">
              {categoryId ? "Editar Categoria" : "Nova Categoria"}
            </h2>

            <BillsFormCategories
              loading={loading}
              categories={categories}
              formData={categoryFormData}
              categoryId={categoryId}
              onChange={handleCategoryChange}
              onSave={async () => {
                const success = await handleSubmit();
                if (success) setIsFormModalOpen(false);
              }}
              onEdit={handleEdit}
              deleteRequest={(id) => {
                setDeleteCategoryId(id);
                setIsDeleteDialogOpen(true);
              }}
            />
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label>Data da medição:</label>
            <span>
              {months.find((m) => m.value === formData.month)?.label}/
              {formData.year}
            </span>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-2 filter-select">
            <label>Conta</label>
            <select
              name="bill"
              value={formData.bill}
              onChange={handleChange}
              required
            >
              <option value="">
                {loading ? "Carregando categorias..." : "Selecione a categoria"}
              </option>
              {!loading &&
                categories.map((c) => (
                  <option key={c.id} value={c.categoryName}>
                    {c.categoryName}
                  </option>
                ))}
            </select>
          </div>

          <div className="grid gap-2">
            <label>Valor Total</label>
            <Input
              id="totalValue"
              type="number"
              step="0.01"
              name="totalValue"
              value={formData.totalValue || ""}
              onChange={handleChange}
              placeholder="R$ 0,00"
              required
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} className="btn-save">
            {!editingBillId ? (
              <>
                <FaPlusCircle /> Cadastrar
              </>
            ) : (
              <>
                <FaPencilAlt /> Editar
              </>
            )}
          </Button>

          <Button onClick={handleOpenCreate} className="btn-new">
            Ver Categorias
          </Button>
        </div>
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir categoria?</AlertDialogTitle>

            <AlertDialogDescription>
              Tem certeza que deseja excluir esta categoria? Esta ação não
              poderá ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>

            <AlertDialogAction
              onClick={() => {
                if (deleteCategoryId !== null) {
                  handleDelete(deleteCategoryId);
                }

                setIsDeleteDialogOpen(false);
                setDeleteCategoryId(null);
              }}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

import { useState } from "react";
import { useApartments } from "../hooks/useApartments";
import { FaLayerGroup, FaPlusCircle } from "react-icons/fa";
import { ApartmentsForm } from "../components/apartments/ApartmentsForm";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import type { Apartment } from "../types/apartments";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

export const Apartments = () => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    initialForm,
    apartments,
    loading,
    apartmentId,
    setApartmentId,
    formData,
    setFormData,
    isFormModalOpen,
    setIsFormModalOpen,
    handleSubmit,
    handleChange,
    handleEdit,
    deleteRequest,
    handleDelete,
  } = useApartments();

  const handleOpenCreate = () => {
    setFormData(initialForm);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (apartment: Apartment) => {
    handleEdit(apartment);
    setIsFormModalOpen(true);
  };

  return (
    <>
      <Dialog
        open={isFormModalOpen}
        onOpenChange={(open) => {
          setIsFormModalOpen(open);

          if (!open) {
            setApartmentId(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {apartmentId
                ? "Edição de Apartamento"
                : "Cadastro de Apartamento"}
            </DialogTitle>
          </DialogHeader>

          <ApartmentsForm
            formData={formData}
            handleChange={handleChange}
            apartmentId={apartmentId}
            onSave={handleSubmit}
          />
        </DialogContent>
      </Dialog>

      <div className="main-container">
        <header className="pages-header">
          <h1>
            <FaLayerGroup /> Apartamentos
          </h1>
          <button onClick={handleOpenCreate} className="btn-new">
            <FaPlusCircle />
            Novo Apartamento
          </button>
        </header>

        {loading && <h4>Carregando apartamentos...</h4>}
        {!loading && apartments.length === 0 && (
          <h4>
            Nenhum apartamento cadastrado! Cadastre clicando em Novo
            Apartamento.
          </h4>
        )}
        {!loading && apartments.length > 0 && (
          <table className="records-table">
            <thead>
              <tr>
                <th>Apartamento</th>
                <th>Proprietário</th>
                <th>Edição</th>
              </tr>
            </thead>
            <tbody>
              {apartments.map((a: Apartment) => (
                <tr key={a.id}>
                  <td>{a.apartment}</td>
                  <td>{a.ownerName}</td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => handleOpenEdit(a)}
                    >
                      <FaPencilAlt />
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => {
                        deleteRequest(a.id);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir apartamento?</AlertDialogTitle>

            <AlertDialogDescription>
              Tem certeza que deseja excluir este apartamento? Esta ação não
              poderá ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>

            <AlertDialogAction
              onClick={() => {
                handleDelete();
                setIsDeleteDialogOpen(false);
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

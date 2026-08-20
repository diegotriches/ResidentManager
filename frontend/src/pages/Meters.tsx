import { useState } from "react";
import { MetersForm } from "../components/meters/MetersForm";
import { MeterTable } from "../components/meters/MeterTable";
import { useMeters } from "../hooks/useMeters";
import type { MetersType } from "../types/meters";
import { FaPlusCircle, FaTachometerAlt } from "react-icons/fa";
import { MeterRecordsTable } from "../components/meters/MeterRecordsTable";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Meters = () => {
  const [activeTab, setActiveTab] = useState<"register" | "history">(
    "register",
  );

  const {
    initialForm,
    meters,
    reportData,
    loading,
    formData,
    setFormData,
    isFormModalOpen,
    setIsFormModalOpen,
    editingMeterId,
    setEditingMeterId,
    idToDelete,
    setIdToDelete,
    handleChange,
    handleEdit,
    handleSubmit,
    handleDelete,
  } = useMeters();

  // Função para abrir para NOVA medição
  const handleOpenCreate = () => {
    setEditingMeterId(null);
    setFormData(initialForm);
    setIsFormModalOpen(true);
  };

  // Função para abrir para EDIÇÃO
  const handleOpenEdit = (meter: MetersType) => {
    handleEdit(meter); // Preenche o formData
    setIsFormModalOpen(true);
  };

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <Dialog
        open={isFormModalOpen}
        onOpenChange={(open) => {
          setIsFormModalOpen(open);

          if (!open) {
            setEditingMeterId(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingMeterId ? "Editar Medição" : "Nova Medição"}
            </DialogTitle>
          </DialogHeader>

          <MetersForm
            formData={formData}
            handleChange={handleChange}
            editingMeterId={editingMeterId}
            onSave={async () => {
              const success = await handleSubmit();
              if (success) {
                setIsFormModalOpen(false);
              }
            }}
          />
        </DialogContent>
      </Dialog>

      <div className="main-container">
        <header className="pages-header">
          <h1>
            <FaTachometerAlt /> Medidores
          </h1>
          <button onClick={handleOpenCreate} className="btn-new">
            <FaPlusCircle /> Nova Medição
          </button>
        </header>

        <nav className="tabs-nav">
          <button
            className={`tab-btn ${activeTab === "register" ? "active" : ""}`}
            onClick={() => setActiveTab("register")}
          >
            Registro de Medições
          </button>
          <button
            className={`tab-btn ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            Visualizar Medições
          </button>
        </nav>

        <div className="tab-content">
          {activeTab === "register" ? (
            <section className="animate-in">
              <MeterRecordsTable
                meters={meters}
                onEdit={handleOpenEdit}
                onDelete={(id) => {
                  setIdToDelete(id);
                  setIsDeleteDialogOpen(true);
                }}
                loading={loading}
              />
            </section>
          ) : (
            <section className="animate-in">
              <div className="meters-page">
                <MeterTable data={reportData} loading={loading} />
              </div>
            </section>
          )}
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
              Tem certeza que deseja excluir esta medição? Esta ação não poderá
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>

            <AlertDialogAction
              onClick={() => {
                if (idToDelete !== null) {
                  handleDelete(idToDelete);
                }

                setIsDeleteDialogOpen(false);
                setIdToDelete(null);
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

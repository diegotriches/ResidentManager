import { useState } from "react";
import { useApartments } from "../hooks/useApartments";
import { FaLayerGroup } from "react-icons/fa";
import { ApartmentsForm } from "../components/apartments/ApartmentsForm";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import type { Apartment } from "../types/apartments";
import { Modal } from "../components/ui/Modal";

interface ModalConfig {
  isOpen: boolean;
  title: string;
  message: string;
  type: "confirm" | "alert";
}

export const Apartments = () => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    isOpen: false,
    title: "",
    message: "",
    type: "alert",
  });

  const handleOpenCreate = () => {
    setFormData(initialForm);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (apartment: Apartment) => {
    handleEdit(apartment);
    setIsFormModalOpen(true);
  };

  const {
    initialForm,
    apartments,
    loading,
    apartmentId,
    setApartmentId,
    formData,
    setFormData,
    handleSubmit,
    handleChange,
    handleEdit,
    deleteRequest,
    handleDelete,
  } = useApartments({ setModalConfig });

  return (
    <>
      <Modal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onConfirm={() => {
          if (apartmentId) {
            handleDelete(apartmentId);
          }
          setModalConfig((prev) => ({ ...prev, isOpen: false }));
        }}
      />

      {isFormModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content form-modal">
            <h2 className="modal-title">
              {apartmentId
                ? "Edição de Apartamento"
                : "Cadastro de Apartamento"}
            </h2>
            <button
              className="close-x"
              onClick={() => {
                setIsFormModalOpen(false);
                setApartmentId(null);
              }}
            >
              &times;
            </button>

            <ApartmentsForm
              formData={formData}
              handleChange={handleChange}
              apartmentId={apartmentId}
              onSave={async () => {
                const sucesso = await handleSubmit();
                if (sucesso) {
                  setIsFormModalOpen(false);
                }
              }}
            />
          </div>
        </div>
      )}

      <div className="main-container">
        <div className="tabs-header">
          <header className="pages-header">
            <h1>Apartamentos</h1>
            <button onClick={handleOpenCreate} className="btn-new">
              <FaLayerGroup /> Novo Apartamento
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
                    <td>{a.number}</td>
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
                        onClick={() => deleteRequest(a.id)}
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
      </div>
    </>
  );
};

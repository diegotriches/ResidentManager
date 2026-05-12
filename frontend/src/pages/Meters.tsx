import { useState, useEffect } from "react";
import { MetersForm } from "../components/meters/MetersForm";
import { Modal } from "../components/ui/Modal";
import { getMeters } from "../services/metersService";
import { useMeterForm } from "../hooks/useMeterForm";
import type { MetersType } from "../types/meters";
import { FaTachometerAlt, FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import "./PagesStyles.css";

interface ModalConfig {
  isOpen: boolean;
  title: string;
  message: string;
  type: "confirm" | "alert";
}

export const Meters = () => {
  const initialForm = { apartment: 201, water: 0, gas: 0 };
  const [meters, setMeters] = useState<MetersType[]>([]);
  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    isOpen: false,
    title: "",
    message: "",
    type: "alert",
  });
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  // Função para buscar medidores (pode virar outro hook)
  const fetchMeters = async () => {
    const response = await getMeters();
    setMeters(response);
  };

  useEffect(() => {
    fetchMeters();
  }, []);

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

  const onSubmitWithClose = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    const success = await handleSubmit(e);

    if (success) {
      setIsFormModalOpen(false);
    }
  };

  // INSTANCIANDO O HOOK
  const {
    formData,
    setFormData,
    editingMeterId,
    setEditingMeterId,
    handleChange,
    handleEdit,
    handleSubmit,
    deleteRequest,
    handleDelete,
  } = useMeterForm({ initialForm, fetchMeters, setModalConfig });

  return (
    <>
      <Modal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onConfirm={handleDelete}
      />
      <div className="main-container">
        <header>
          <h1>Gestão de Medidores</h1>
          <button onClick={handleOpenCreate} className="btn-new">
            <FaTachometerAlt /> Nova Medição
          </button>
        </header>

        {isFormModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content form-modal">
              <button
                className="close-x"
                onClick={() => setIsFormModalOpen(false)}
              >
                X
              </button>
              <h2 className="modal-title">
                {editingMeterId ? "Editar Medição" : "Nova Medição"}
              </h2>

              <MetersForm
                formData={formData}
                handleChange={handleChange}
                handleSubmit={onSubmitWithClose}
                editingMeterId={editingMeterId}
              />
            </div>
          </div>
        )}

        <div className="records-container">
          <table className="records-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Apartamento</th>
                <th>Cons. Água</th>
                <th>Cons. Gás</th>
                <th>Registro</th>
                <th>Atualizado</th>
                <th>Editar/Excluir</th>
              </tr>
            </thead>
            <tbody>
              {meters.map((m) => (
                <tr key={m.meter_id}>
                  <td>{m.meter_id}</td>
                  <td>{m.apartment}</td>
                  <td>{m.water}</td>
                  <td>{m.gas}</td>
                  <td>{m.createdAt}</td>
                  <td>{m.updatedAt}</td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => handleOpenEdit(m)}
                    >
                      <FaPencilAlt />
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => deleteRequest(m.meter_id)}
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

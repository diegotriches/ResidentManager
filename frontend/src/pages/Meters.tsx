import { useState, useEffect } from "react";
import { MetersForm } from "../components/meters/metersForm";
import { Modal } from "../components/ui/Modal";
import { FaTachometerAlt, FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import "./PagesStyles.css";

export const Meters = () => {
  const initialForm = { name: "", tel: "", email: "", adress: "" };
  const [meters, setMeters] = useState([]);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
  });
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  // Função para buscar medidores (pode virar outro hook)
  const fetchMeters = async () => {
    const response = await getMeters();
    setMeters(response.data);
  };

  useEffect(() => {
    fetchMeters();
  }, []);

  const openModal = (title, message) =>
    setModalConfig({ isOpen: true, title: message });

  // Função para abrir para NOVA medição
  const handleOpenCreate = () => {
    setEditingMeterId(null);
    setFormData(initialForm);
    setIsFormModalOpen(true);
  };

  // Função para abrir para EDIÇÃO
  const handleOpenEdit = (meter) => {
    handleEdit(meter); // Preenche o formData
    setIsFormModalOpen(true);
  };

  // Interceptamos o handleSubmit para fechar o modal após o sucesso
  const onSubmitWithClose = async (e) => {
    // O handleSubmit agora retorna true ou false
    const success = await handleSubmit(e);

    // Só fecha o modal do formulário se a operação no banco deu certo
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
  } = useMeterForm(initialForm, fetchMeters, setModalConfig);

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
                <th>Nome</th>
                <th>Telefone</th>
                <th>E-mail</th>
                <th>Endereço</th>
                <th>Registro</th>
                <th>Atualizado</th>
                <th>Editar/Excluir</th>
              </tr>
            </thead>
            <tbody>
              {meter.map((m) => (
                <tr key={m.meter_id}>
                  <td>{m.meter_id}</td>
                  <td>{m.name}</td>
                  <td>{m.tel}</td>
                  <td>{m.email}</td>
                  <td>{m.adress}</td>
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

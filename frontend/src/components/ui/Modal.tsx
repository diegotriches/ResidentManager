import "./Modal.css";

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void; // opcional, só usado quando type === "confirm"
  type?: "confirm" | "alert"; // restringe os valores possíveis
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  message,
  onClose,
  onConfirm,
  type = "alert", // valor padrão
}) => {
  if (!isOpen) return null; // Se não estiver aberto, não renderiza nada

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{title}</h3>
        <p>{message}</p>

        <div className="modal-actions">
          {/* Se o tipo for 'confirm', mostra dois botões */}
          {type === "confirm" ? (
            <>
              <button onClick={onConfirm} className="btn-confirm">
                Sim, Excluir
              </button>
              <button onClick={onClose} className="btn-cancel">
                Cancelar
              </button>
            </>
          ) : (
            /* Caso contrário, mostra apenas o botão de fechar (Aviso comum) */
            <button onClick={onClose}>Fechar</button>
          )}
        </div>
      </div>
    </div>
  );
};

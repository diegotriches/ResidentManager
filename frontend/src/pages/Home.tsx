import { FaHome } from "react-icons/fa";
import { useHome } from "../hooks/useHome";

export const Home = () => {
  const { pendingApartments, loading } = useHome();

  return (
    <div className="main-container">
      <header className="pages-header">
        <h1>
          <FaHome /> Home
        </h1>
      </header>
      <h3>Contas em aberto:</h3>
      {loading && <p>Carregando apartamentos...</p>}
      {!loading && pendingApartments.length === 0 && (
        <p>Tudo pago! Nenhuma pendência para esse mês.</p>
      )}
      {!loading && pendingApartments.length > 0 && (
        <div className="form-field">
          {pendingApartments.map((item) => {
            return (
              <div key={item.apartment}>
                <p>Possui pendência: {item.apartment}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

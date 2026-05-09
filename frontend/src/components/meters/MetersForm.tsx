import "../FormStyles.css";

export const MetersForm = (
  formData,
  handleSubmit,
  handleChange,
  editingMeterId,
) => {
  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-field">
          <label>Apartamento</label>
          <select
            name="apartment"
            value={formData.apartment}
            onChange={handleChange}
          >
            <option value={apartment}>{apartment}</option> // Gerar opções conforme os apartamentos
          </select>
        </div>

        <div className="form-field">
          <label>Consumo de Água</label>
          <input name="water" value={formData.water} onChange={handleChange} required />
        </div>

        <div className="form-field">
          <label>Consumo de Gás</label>
          <input name="text" value={formData.gas} onChange={handleChange} required />
        </div>

        <button
          type="submit"
          className={`btn-submit ${editingMeterId ? "editing" : ""}`}
        >
          {editingMeterId ? "Salvar Alterações" : "Cadastrar Medidor"}
        </button>
      </form>
    </div>
  );
};

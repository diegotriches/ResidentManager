/**
 * Formata um número para a moeda brasileira (R$)
 * @param value - O valor numérico a ser formatado
 * @returns String formatada: "R$ 1.234,56"
 */
export const formatCurrency = (value: number | undefined | null): string => {
  if (value === undefined || value === null) return "R$ 0,00";
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

/**
 * Formata um número decimal para o padrão de medição (3 casas decimais)
 * @param value - O valor (m³ ou kg)
 * @returns String formatada: "1.234"
 */
export const formatDecimal = (value: number | undefined | null): string => {
  if (value === undefined || value === null) return "0.000";
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
};

/**
 * Formata uma string de data (ISO) para o padrão brasileiro
 * @param dateString - A data vinda do banco (createdAt/updatedAt)
 * @returns String formatada: "DD/MM/AAAA"
 */
export const formatDate = (dateString: string | undefined | null): string => {
  if (!dateString) return "--/--/----";
  return new Date(dateString).toLocaleDateString("pt-BR");
};
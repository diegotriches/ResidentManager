import api from "./axiosInstance";
import type { VoucherReportType } from "../types/vouchers";

/**
 * Busca o relatório de consumo consolidado para todos os apartamentos.
 * O backend utiliza a tabela mestre para garantir que todos os 
 * apartamentos (201-803) apareçam, mesmo sem leitura.
 */
export const getConsumptionReport = async (
  month: string, 
  year: string
): Promise<VoucherReportType[]> => {
  const response = await api.get<VoucherReportType[]>(`/meters/report/consumption`, {
    params: { month, year }
  });
  return response.data;
};
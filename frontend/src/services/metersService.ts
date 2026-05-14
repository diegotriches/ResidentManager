import api from "./axiosInstance";
import type {
  MetersType,
  MeterFormData,
  MeterReportType,
} from "../types/meters";

export async function getMeters(month?: string, year?: string): Promise<MetersType[]> {
  const response = await api.get<MetersType[]>("/meters", {
    params: { month, year },
  });
  return response.data;
}

export async function createMeters(data: MeterFormData): Promise<MetersType> {
  const response = await api.post<MetersType>("/meters", data);
  return response.data;
}

export async function updateMeters(
  id: number,
  data: Partial<MetersType>,
): Promise<MetersType> {
  const response = await api.put<MetersType>(`/meters/${id}`, data);
  return response.data;
}

export async function deleteMeters(id: number): Promise<void> {
  await api.delete(`/meters/${id}`);
}

/**
 * Busca o relatório de consumo consolidado para todos os apartamentos.
 * O backend utiliza a tabela mestre para garantir que todos os
 * apartamentos (201-803) apareçam, mesmo sem leitura.
 */
export const getConsumptionReport = async (
  month: string,
  year: string,
): Promise<MeterReportType[]> => {
  const response = await api.get<MeterReportType[]>(
    `/meters/report/consumption`,
    {
      params: { month, year },
    },
  );
  return response.data;
};

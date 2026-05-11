import api from "./axiosInstance";
import type { MetersType, MeterFormData } from "../types/meters";

export async function getMeters(): Promise<MetersType[]> {
  const response = await api.get<MetersType[]>("/meters");
  return response.data;
}

export async function createMeters(
  data: MeterFormData): Promise<MetersType> {
  const response = await api.post<MetersType>("/meters", data);
  return response.data;
}

export async function updateMeters(
  id: number,
  data: Partial<Omit<MetersType, "id">>,
): Promise<MetersType> {
  const response = await api.put<MetersType>(`/meters/${id}`, data);
  return response.data;
}

export async function deleteMeters(id: number): Promise<void> {
  await api.delete(`/meters/${id}`);
}

import api from "./axiosInstance";
import type { BillsType, BillsFormData } from "../types/bills";

export async function getBills(): Promise<BillsType[]> {
  const response = await api.get<BillsType[]>("/bills");
  return response.data;
}

export async function createBills(
  data: BillsFormData): Promise<BillsType> {
  const response = await api.post<BillsType>("/bills", data);
  return response.data;
}

export async function updateBills(
  id: number,
  data: Partial<BillsType>,
): Promise<BillsType> {
  const response = await api.put<BillsType>(`/bills/${id}`, data);
  return response.data;
}

export async function deleteBills(id: number): Promise<void> {
  await api.delete(`/bills/${id}`);
}

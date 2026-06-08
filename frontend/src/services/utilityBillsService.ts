import api from "./axiosInstance";
import type {
  UtilityBillType,
  UtilityFormDataType,
} from "../types/utilityBills";

export async function getUtilityBills(
  month?: string,
  year?: string,
): Promise<UtilityBillType[]> {
  // Ajustado com a barra inicial
  const response = await api.get<UtilityBillType[]>("/utility-bills", {
    params: { month, year },
  });
  return response.data;
}

export async function createUtilityBill(data: UtilityFormDataType) {
  const response = await api.post("/utility-bills", data);
  return response.data;
}

export async function updateUtilityBill(
  id: number,
  data: Partial<UtilityBillType>,
): Promise<UtilityBillType> {
  const response = await api.put<UtilityBillType>(`/utility-bills/${id}`, data);
  return response.data;
}

export async function deleteUtilityBill(id: number): Promise<void> {
  await api.delete(`/utility-bills/${id}`);
}
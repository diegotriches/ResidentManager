import api from "../api/axiosInstance";

interface BillsCategories {
  id?: number;
  categoryName: string;
}

export async function getBillsCategories(): Promise<BillsCategories[]> {
  const response = await api.get<BillsCategories[]>("/bills/categories");
  return response.data;
}

export async function createBillCategory(data: BillsCategories) {
  const response = await api.post<BillsCategories>("/bills/categories", data);
  return response.data;
}

export async function updateBillsCategories(id: number, data: BillsCategories) {
  const response = await api.put<BillsCategories>(
    `/bills/categories/${id}`,
    data,
  );
  return response.data;
}

export async function deleteBillsCategories(id: number): Promise<void> {
  await api.delete(`/bills/categories/${id}`);
}

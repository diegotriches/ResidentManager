import api from "./axiosInstance";
import type { Apartment, ApartmentsData } from "../types/apartments";

export async function getApartments(): Promise<Apartment[]> {
  const response = await api.get("/apartments");
  return response.data;
}

export async function createApartments(
  data: ApartmentsData,
): Promise<Apartment> {
  const response = await api.post("/apartments", data);
  return response.data;
}

export async function updateApartments(
  id: number,
  data: ApartmentsData,
): Promise<Apartment> {
  const response = await api.put(`/apartments/${id}`, data);
  return response.data;
}

export async function deleteApartments(id: number) {
  await api.delete(`/apartments/${id}`);
}

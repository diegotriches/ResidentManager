import api from "../api/axiosInstance";

export async function getPendingApartments(month: number, year: number) {
  const response = await api.get("/home/pendingapartments", {
    params: { month, year },
  });
  return response.data;
}

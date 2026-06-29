import api from "./axiosInstance";

export async function getPendingApartments(month: string, year: string) {
  const response = await api.get("/home/pendingapartments", {
    params: { month, year },
  });
  return response.data;
}

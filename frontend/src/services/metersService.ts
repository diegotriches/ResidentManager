import api from "./axiosInstance";

export async function getMeters() {
  return api.get("/meters");
}

export async function createMeters(data) {
  return api.post("/meters", data);
}

export async function updateMeters(id, data) {
  return api.put(`/meters/${id}`, data);
}

export async function deleteMeters(id) {
  return api.delete(`/meters/${id}`);
}

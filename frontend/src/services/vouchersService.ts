import api from "./axiosInstance";

export async function getFinanceReport(month: number, year: number) {
  const response = await api.get(`/vouchers/report/finance`, {
    params: { month, year },
  });
  return response.data;
}

export async function updateVoucherStatus(
  apartmentId: number,
  month: number,
  year: number,
  isPaid: boolean,
) {
  const response = await api.put('/vouchers/status', {
    apartmentId,
    month,
    year,
    isPaid,
  });
  
  return response.data;
}

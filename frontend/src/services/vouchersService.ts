import api from "./axiosInstance";

export async function getFinanceReport(month: string, year: string) {
  const response = await api.get(`/vouchers/report/finance`, {
    params: { month, year },
  });
  return response.data;
}

export async function updateVoucherStatus(
  apartment: number | string,
  month: number | string,
  year: number | string,
  isPaid: boolean,
) {
  const response = await api.put('/vouchers/status', {
    apartment,
    month,
    year,
    is_paid: isPaid,
  });
  
  return response.data;
}

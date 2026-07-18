// 1. O que vem exatamente do seu Repository do backend (API)
export interface BackendVoucherReport {
  apartmentId: number;
  apartment: string;
  waterCurrent: number;
  gasCurrent: number;
  waterPrevious: number;
  gasPrevious: number;
  isPaid: number | boolean; // O SQLite pode retornar 0 ou 1
  gasConsumption: number;
  waterPricePerM3: number;
  waterFeePerApartment: number;
  totalWaterValue: number;
}

// 2. O que o seu hook calcula e entrega limpo para os componentes React usar
export interface FrontendVoucher {
  apartmentId: number;
  apartment: string;
  fixedRate: number;
  totalWaterValue: number;
  gasValue: number;
  total: number;
  isPaid: boolean;
}
export interface VoucherReport {
  apartmentId: number;
  waterCurrent: number;
  gasCurrent: number;
  waterPrevious: number;
  gasPrevious: number;
  isPaid: boolean;
  gasConsumption: number;
  waterPricePerM3: number;
  waterFeePerApartment: number;
  totalWaterValue: number;
}

export interface VoucherReportItem extends VoucherReport {
  apartment: string;
  fixedRate: number;
  waterTotalValue: number;
  gasValue: number;
  total: number;
}
export interface VoucherReport {
  apartment: string;
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
  fixedRate: number;
  waterTotalValue: number;
  gasValue: number;
  total: number;
}
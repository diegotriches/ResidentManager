export type MetersType = {
  id: number;
  month: string;
  year: number;
  apartment: number;
  apartmentId: number;
  water: number;
  gas: number;
  createdAt: string;
  updatedAt: string;
};

export type MeterFormData = {
  month: string;
  year: number;
  apartmentId: number;
  water: number;
  gas: number;
};

export interface MeterReportType {
  apartment: number;
  apartmentId: number;
  waterCurrent: number | null;
  gasCurrent: number | null;
  waterPrevious: number;
  gasPrevious: number;
  waterConsumption: number;
  gasConsumption: number;
  waterPricePerM3: number;
  totalWaterTaxes: number;
  waterSplitCount: number;
  waterFeePerApartment: number;
  totalWaterCost: number;
}
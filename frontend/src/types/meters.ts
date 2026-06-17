export type MetersType = {
  id: number;
  month: string;
  year: number;
  apartment: number;
  water: number;
  gas: number;
  createdAt: string;
  updatedAt: string;
};

export type MeterFormData = {
  month: string;
  year: number;
  apartment: number;
  water: number;
  gas: number;
};

export interface MeterReportType {
  apartment: number;
  water_current: number | null;
  gas_current: number | null;
  water_previous: number;
  gas_previous: number;
  water_consumption: number;
  gas_consumption: number;
  water_price_per_m3: number;
  total_water_taxes: number;
  water_split_count: number;
  water_fee_per_apartment: number;
  total_water_cost: number;
}
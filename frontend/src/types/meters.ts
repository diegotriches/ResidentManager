export type MetersType = {
  meter_id: number;
  apartment: number;
  water: number;
  gas: number;
  createdAt: string;
  updatedAt: string;
};

export type MeterFormData = {
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
}
export type MetersType = {
  meter_id: number;
  apartment: number;
  water: number;
  gas: number;
  createdAt?: string;
  updatedAt?: string;
};

export type MeterFormData = {
  apartment: number;
  water: number;
  gas: number;
};

export type MetersType = {
  meter_id: number;
  apartment: string;
  water: number;
  gas: number;
  createdAt?: string;
  updatedAt?: string;
};

export type MeterFormData = {
  apartment: string;
  water: number;
  gas: number;
};

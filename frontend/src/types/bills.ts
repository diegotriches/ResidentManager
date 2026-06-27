export type BillsType = {
  id?: number;
  month: string;
  year: number;
  bill: string;
  totalValue: number;
  unitValue: number;
  createdAt?: string;
  updatedAt?: string;
};

export type BillsFormData = {
  month: string;
  year: number;
  bill: string;
  totalValue: number;
  unitValue: number;
};

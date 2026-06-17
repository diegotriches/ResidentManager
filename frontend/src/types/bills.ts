export type BillsType = {
  bill_id: number;
  month: string;
  year: number;
  bill: string;
  totalValue: number;
  unitValue: number;
  createdAt?: string;
  updatedAt?: string;
};

export type BillsFormData = {
  bill: string;
  totalValue: number;
  unitValue: number;
};

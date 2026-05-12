export type BillsType = {
  bill_id: number;
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

export interface BillsType extends BillsFormData {
  id: number;
  createdAt?: string;
  updatedAt?: string;
};

export interface BillsFormData {
  month: number;
  year: number;
  bill: string;
  totalValue: number;
};

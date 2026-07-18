export interface UtilityBillType {
  id: number;
  type: "water" | "gas";
  month: number;
  year: number;
  
  // Campos de Água
  totalConsumption?: number;
  consumptionValue?: number;
  taxesValue?: number;
  
  // Campos de Gás
  cylinderType?: string;
  unitPrice?: number;
  multiplierFactor?: number;
  
  // Configuração global de rateio fixo
  createdAt: string;
  updatedAt: string;
}

// Tipo específico para o formulário de criação (Omite o id e campos de data automático)
export type UtilityFormDataType = Omit<UtilityBillType, "id" | "createdAt" | "updatedAt">;
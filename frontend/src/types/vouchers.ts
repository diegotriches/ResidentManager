export interface VoucherReportType {
  apartment: number;
  water_current: number | null;
  gas_current: number | null;
  water_previous: number;
  gas_previous: number;
  water_consumption: number;
  gas_consumption: number;
}
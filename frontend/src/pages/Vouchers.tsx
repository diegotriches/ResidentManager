import React, { useEffect, useState } from 'react';
import { FilterBar } from '../components/layout/FilterBar';
import { VoucherTable } from '../components/vouchers/VoucherTable';
import * as vouchersService from '../services/vouchersService';
import type { VoucherReportType } from '../types/vouchers';

export const Vouchers: React.FC = () => {
  const [month, setMonth] = useState("05");
  const [year, setYear] = useState("2026");
  const [reportData, setReportData] = useState<VoucherReportType[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const data = await vouchersService.getConsumptionReport(month, year);
      setReportData(data);
    } catch (error) {
      console.error("Erro ao carregar relatório", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [month, year]); // Recarrega sempre que o filtro mudar

  return (
    <div className="vouchers-page">
      <h2>Vouchers de Consumo - Residencial Aconchego</h2>
      <FilterBar 
        month={month} 
        setMonth={setMonth} 
        year={year} 
        setYear={setYear} 
      />
      <VoucherTable data={reportData} loading={loading} />
    </div>
  );
};
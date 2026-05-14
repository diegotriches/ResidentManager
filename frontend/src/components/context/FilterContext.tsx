import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface FilterContextType {
  month: string;
  year: string;
  setMonth: (month: string) => void;
  setYear: (year: string) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [month, setMonth] = useState("01");
  const [year, setYear] = useState("2026");

  return (
    <FilterContext.Provider value={{ month, year, setMonth, setYear }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter deve ser usado dentro de um FilterProvider');
  }
  return context;
};
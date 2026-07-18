import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface FilterContextType {
  month: number;
  year: number;
  setMonth: (month: number) => void;
  setYear: (year: number) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());

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
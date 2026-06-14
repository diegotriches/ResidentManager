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
  const [month, setMonth] = useState(String(new Date().getMonth() + 1).padStart(2, '0'));
  const [year, setYear] = useState(String(new Date().getFullYear()));

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
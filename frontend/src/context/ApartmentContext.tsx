import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import { getApartments } from "../services/apartmentsService";
import type { ApartmentsData } from "../types/apartments";

interface ApartmentContextType {
  apartments: ApartmentsData[];
  loading: boolean;
  fetchApartments: () => Promise<void>;
}

const ApartmentContext = createContext<ApartmentContextType | undefined>(
  undefined,
);

export const ApartmentProvider = ({ children }: { children: ReactNode }) => {
  const [apartments, setApartments] = useState<ApartmentsData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApartments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getApartments();
      const sorted = data.sort((a, b) =>
        String(a.number).localeCompare(String(b.number)),
      );
      setApartments(sorted);
    } catch (error) {
      console.error("Erro ao carregar contexto de apartamentos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApartments();
  }, [fetchApartments]);

  return (
    <ApartmentContext.Provider
      value={{ apartments, loading, fetchApartments: fetchApartments }}
    >
      {children}
    </ApartmentContext.Provider>
  );
};

export const useApartmentContext = () => {
  const context = useContext(ApartmentContext);
  if (!context) {
    throw new Error(
      "useApartmentContext deve ser usado dentro de um ApartmentProvider",
    );
  }
  return context;
};

import { useCallback, useEffect, useState } from "react";
import { getPendingApartments } from "../services/homeService";
import { useFilter } from "../context/FilterContext";

interface PendingApartment {
    apartment: string;
}

export const useHome = () => {
  const { month, year } = useFilter();
  const [pendingApartments, setPendingApartments] = useState<PendingApartment[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPendingApartments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getPendingApartments(month, year);
      setPendingApartments(response);
    } catch (error) {
      console.error("Erro ao carregar contas pendentes:", error);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    fetchPendingApartments();
  }, [fetchPendingApartments]);

  return {
    pendingApartments,
    loading,
  };
};

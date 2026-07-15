import { useQuery } from "@tanstack/react-query";
import { getPendingApartments } from "../services/homeService";
import { useFilter } from "../context/FilterContext";

export const useHome = () => {
  const { month, year } = useFilter();
  
  // O useQuery substitui os estados de loading, data e a lógica do useEffect
  const { data: pendingApartments = [], isLoading: loading } = useQuery({
    // A chave da query identifica esse cache. Se 'month' ou 'year' mudarem, 
    // o TanStack Query refaz a busca na API automaticamente.
    queryKey: ["pendingApartments", month, year],
    
    // A função que realmente busca os dados da API
    queryFn: () => getPendingApartments(month, year),
    
    // Opcional: Garante que não fique re-buscando toda vez que clica na janela
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  return {
    pendingApartments,
    loading,
  };
};

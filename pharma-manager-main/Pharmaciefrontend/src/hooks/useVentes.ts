import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  cancelVente,
  createVente,
  fetchVentes,
} from "../api/ventesApi";

export const useVentes = (filters: any) => {
  const queryClient = useQueryClient();

  // GET ventes
  const query = useQuery({
    queryKey: ["ventes", filters],
    queryFn: () => fetchVentes(filters),
    
  });

  //  CREATE vente
  const createMutation = useMutation({
    mutationFn: createVente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ventes"] });
    },
  });

  // CANCEL vente
  const cancelMutation = useMutation({
    mutationFn: cancelVente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ventes"] });
    },
  });

  return {
    //  Data
    ventes: query.data?.results || [],
    count: query.data?.count || 0,

    //  States
    loading: query.isLoading,
    error: query.error,

    submitting:
      createMutation.isPending || cancelMutation.isPending,

    //  Actions
    reloadVentes: query.refetch,

    addVente: createMutation.mutateAsync,
    annulerVente: cancelMutation.mutateAsync,
  };
};
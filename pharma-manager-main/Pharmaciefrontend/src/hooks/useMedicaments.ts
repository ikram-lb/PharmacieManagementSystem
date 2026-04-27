import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createMedicament,
  deleteMedicament,
  fetchMedicaments,
  updateMedicament,
} from "../api/medicamentApi";

export const useMedicaments = (filters: any) => {
  const queryClient = useQueryClient();

  // GET medicaments
  const query = useQuery({
    queryKey: ["medicaments", filters],
    queryFn: () => fetchMedicaments(filters),
  });

  //  CREATE
  const createMutation = useMutation({
    mutationFn: createMedicament,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicaments"] });
    },
  });

  //  UPDATE
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: any) =>
      updateMedicament(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicaments"] });
    },
  });

  //  DELETE
  const deleteMutation = useMutation({
    mutationFn: deleteMedicament,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicaments"] });
    },
  });

  return {
    //  Data
    medicaments: query.data?.results || [],
    count: query.data?.count || 0,

    //  States
    loading: query.isLoading,
    error: query.error,

    submitting:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,

    //  Actions
    reloadMedicaments: query.refetch,

    addMedicament: createMutation.mutateAsync,
    editMedicament: (id: number, payload: any) =>
      updateMutation.mutateAsync({ id, payload }),
    removeMedicament: deleteMutation.mutateAsync,
  };
};
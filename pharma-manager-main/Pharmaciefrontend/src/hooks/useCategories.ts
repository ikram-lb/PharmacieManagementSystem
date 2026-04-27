import { createCategorie, deleteCategorie, fetchCategories, updateCategorie } from "@/api/categoriesApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCategories = () => {
   const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

    //  CREATE
  const createMutation = useMutation({
    mutationFn: createCategorie,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  //  UPDATE
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: any) =>
      updateCategorie(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  //  DELETE
  const deleteMutation = useMutation({
    mutationFn: deleteCategorie,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return {
    // data
    categories: query.data?.results || [],
    count: query.data?.count || 0,

    // states
    loading: query.isLoading,
    error: query.error,
    
    submitting:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,

    //  Actions
    reloadCategories: query.refetch,

    addCategorie: createMutation.mutateAsync,
    editCategorie: (id: number, payload: any) =>
      updateMutation.mutateAsync({ id, payload }),
    removeCategorie: deleteMutation.mutateAsync,
  };
};
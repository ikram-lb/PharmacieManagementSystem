import axiosInstance from "@/api/axiosConfig";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ── Types ─────────────────────────────────────────────────────
export interface CaissierPayload {
  username: string;
  email: string;
  password?: string; // ✅ optional for edit
}

export interface Caissier {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: "Caissier";
}

// ── API functions ─────────────────────────────────────────────
export const fetchCaissiers = async (): Promise<{ results: Caissier[]; count: number }> => {
  const { data } = await axiosInstance.get("/users/caissiers/");
  return data;
};

export const fetchCaissierById = async (id: string | number): Promise<Caissier> => {
  const { data } = await axiosInstance.get(`/users/caissiers/${id}/`);
  return data;
};

export const createCaissier = async (payload: CaissierPayload): Promise<Caissier> => {
  const { data } = await axiosInstance.post("/users/caissiers/", payload);
  return data;
};

export const updateCaissier = async ({
  id,
  payload,
}: {
  id: string | number;
  payload: CaissierPayload;
}): Promise<Caissier> => {
  const { data } = await axiosInstance.put(`/users/caissiers/${id}/`, payload);
  return data;
};

export const deleteCaissier = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/users/caissiers/${id}/`);
};

// ── Hook ──────────────────────────────────────────────────────
export const useCaissiers = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["caissiers"],
    queryFn: fetchCaissiers,
  });

  const createMutation = useMutation({
    mutationFn: createCaissier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caissiers"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateCaissier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caissiers"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCaissier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caissiers"] });
    },
  });

  return {
    // list
    caissiers: query.data?.results ?? [],
    count: query.data?.count ?? 0,
    loading: query.isLoading,
    error: query.error,

    // mutations
    submitting:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,

    addCaissier: createMutation.mutateAsync,

    updateCaissier: (id: string | number, payload: CaissierPayload) =>
      updateMutation.mutateAsync({ id, payload }),

    removeCaissier: deleteMutation.mutateAsync,

    // fetch single (used in form)
    getCaissierById: fetchCaissierById,
  };
};
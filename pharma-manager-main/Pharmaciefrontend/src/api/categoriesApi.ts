import { axiosInstance } from "./axiosConfig";
import type { PaginatedResponse } from "./medicamentApi";


export interface Categorie {
  id: number;
  nom: string;
  description: string;
  date_creation: string;
  nb_medicaments: number;
  quantite_totale: number;
}

export type CategoriePayload = Omit<Categorie, "id" | "date_creation">;

export const fetchCategories = async (params = {}): Promise<PaginatedResponse<Categorie>> => {
  const response = await axiosInstance.get("/categories/", { params });
  return response.data;
};

export const createCategorie = async (data: CategoriePayload): Promise<Categorie> => {
  const response = await axiosInstance.post("/categories/", data);
  return response.data;
};

export const updateCategorie = async (id: number, data: Partial<CategoriePayload>): Promise<Categorie> => {
  const response = await axiosInstance.patch(`/categories/${id}/`, data);
  return response.data;
};

export const deleteCategorie = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/categories/${id}/`);
};
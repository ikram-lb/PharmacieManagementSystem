import { axiosInstance } from "./axiosConfig";

export interface Medicament {
  id: number;
  nom: string;
  dci: string;
  categorie: number;
  categorie_nom: string;
  forme: string;
  dosage: string;
  prix_achat: number;
  prix_vente: number;
  stock_actuel: number;
  stock_minimum: number;
  date_expiration: string;
  ordonnance_requise: boolean;
  date_creation: string;
  est_actif: boolean;
  est_en_alerte: boolean;
}

export type MedicamentPayload = Omit<
  Medicament,
  "id" | "date_creation" | "est_en_alerte" | "categorie_nom"
>;

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const fetchMedicaments = async (params = {}): Promise<PaginatedResponse<Medicament>> => {
  const response = await axiosInstance.get("/medicaments/", { params });
  return response.data;
};

export const fetchMedicamentAlerts = async (): Promise<Medicament[]> => {
  const response = await axiosInstance.get("/medicaments/alertes/");
  return response.data;
};

export const createMedicament = async (data: MedicamentPayload): Promise<Medicament> => {
  const response = await axiosInstance.post("/medicaments/", data);
  return response.data;
};

export const updateMedicament = async (id: number, data: Partial<MedicamentPayload>): Promise<Medicament> => {
  const response = await axiosInstance.patch(`/medicaments/${id}/`, data);
  return response.data;
};

export const deleteMedicament = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/medicaments/${id}/`);
};
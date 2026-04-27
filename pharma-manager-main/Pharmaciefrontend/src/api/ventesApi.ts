import axiosInstance from "./axiosConfig";
import type { PaginatedResponse } from "./medicamentApi";


export type VenteStatut =  "COMPLETEE" | "ANNULEE";

export interface LigneVenteRead {
  id: number;
  medicament: number;
  medicament_nom: string;
  medicament_dosage: string;
  quantite: number;
  prix_unitaire: number;
  sous_total: number;
}

export interface LigneVenteWrite {
  medicament: number;
  quantite: number;
}

export interface Vente {
  id: number;
  reference: string;
  date_vente: string;
  total_ttc: number;
  statut: VenteStatut;
  notes: string;
  est_actif: boolean;
  lignes_detail: LigneVenteRead[];
}

export interface VentePayload {
  notes?: string;
  lignes: LigneVenteWrite[];
}


export const fetchVentes = async (params = {}): Promise<PaginatedResponse<Vente>> => {
  const response = await axiosInstance.get("/ventes/", { params });
  return response.data;
};

export const createVente = async (data: VentePayload): Promise<Vente> => {
  const response = await axiosInstance.post("/ventes/", data);
  return response.data;
};

export const cancelVente = async (id: number): Promise<Vente> => {
  const response = await axiosInstance.post(`/ventes/${id}/annuler/`);
  return response.data;
};
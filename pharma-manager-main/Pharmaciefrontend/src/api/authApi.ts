// ─────────────────────────────────────────────────────────────
// src/api/authApi.ts
// ─────────────────────────────────────────────────────────────
import axiosInstance from "./axiosConfig";

export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface AuthUser {
  user_id: number;
  username: string;
  email: string;
  role: "DoctorAdmin" | "Caissier";
}

export const login = async (
  username: string,
  password: string
): Promise<TokenResponse> => {
  const { data } = await axiosInstance.post<TokenResponse>("/token/", {
    username,
    password,
  });
  return data;
};

/** Decode the JWT payload without verifying the signature (client-side only). */
export function decodeToken(token: string): AuthUser {
  const base64 = token.split(".")[1];
  const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
  return JSON.parse(json) as AuthUser;
}



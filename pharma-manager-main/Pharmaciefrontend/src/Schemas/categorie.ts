import { z } from "zod";

export const categorieSchema = z.object({
  nom: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères.")
    .max(150, "Le nom ne peut pas dépasser 150 caractères."),
  description: z.string().max(500, "La description ne peut pas dépasser 500 caractères.").optional().default(""),
});

export type CategorieFormData = z.infer<typeof categorieSchema>;
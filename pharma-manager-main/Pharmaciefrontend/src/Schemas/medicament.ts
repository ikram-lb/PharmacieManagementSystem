import { z } from "zod";

export const medicamentSchema = z.object({
  nom: z.string().min(1, "Nom requis"),
  dci: z.string().min(1, "DCI requis"),
  categorie: z.coerce.number().min(1, "Catégorie requise"), 
  forme: z.string().min(1),
  dosage: z.string().min(1),
  prix_achat: z.coerce.number().min(0),
  prix_vente: z.coerce.number().min(0),
  stock_actuel: z.number().min(0),
  stock_minimum: z.number().min(0),
  date_expiration: z.string(),
  ordonnance_requise: z.boolean(),
  est_actif: z.boolean().default(true),
});

export type MedicamentFormData = z.infer<typeof medicamentSchema>;
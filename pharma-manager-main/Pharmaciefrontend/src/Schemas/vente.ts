import { z } from "zod";

export const ligneVenteSchema = z.object({
  // _key is local only — not sent to API
  _key: z.number(),
  medicament: z
    .union([z.number(), z.literal("")])
    .refine((v) => v !== "" && v > 0, {
      message: "Sélectionnez un médicament.",
    }),
 quantite: z
  .number()
  .refine((val) => !isNaN(val), {
    message: "La quantité doit être un nombre.",
  })
  .int("La quantité doit être un entier.")
  .min(1, "La quantité doit être ≥ 1.")
});

export const venteSchema = z
  .object({
    notes: z.string().max(500, "Les notes ne peuvent pas dépasser 500 caractères.").optional().default(""),
    lignes: z
      .array(ligneVenteSchema)
      .min(1, "Ajoutez au moins une ligne."),
  })
  .superRefine((data, ctx) => {
    // Duplicate medicament check
    const ids = data.lignes
      .map((l) => l.medicament)
      .filter((id): id is number => typeof id === "number");

    const seen = new Set<number>();
    ids.forEach((id, index) => {
      if (seen.has(id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Un médicament ne peut apparaître qu'une seule fois.",
          path: ["lignes", index, "medicament"],
        });
      }
      seen.add(id);
    });
  });

export type VenteFormData = z.infer<typeof venteSchema>;
export type LigneVenteFormData = z.infer<typeof ligneVenteSchema>;
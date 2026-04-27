import { z } from "zod";

const usernameField = z
  .string()
  .min(3, "Minimum 3 caractères.")
  .max(50, "Maximum 50 caractères.")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Uniquement des lettres, chiffres et underscores."
  );

const emailField = z.string().email("Adresse email invalide.");

// ── Create: password required ─────────────────────────────────
export const caissierCreateSchema = z
  .object({
    username: usernameField,
    email: emailField,
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères."),
    confirm_password: z.string(),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirm_password"],
  });

// ── Edit: password optional ───────────────────────────────────
export const caissierEditSchema = z
  .object({
    username: usernameField,
    email: emailField,
    password: z
      .string()
      .min(8, "Minimum 8 caractères.")
      .or(z.literal(""))
      .optional()
      .default(""),
    confirm_password: z.string().optional().default(""),
  })
  .refine(
    (d) => !d.password || d.password === d.confirm_password,
    {
      message: "Les mots de passe ne correspondent pas.",
      path: ["confirm_password"],
    }
  );

export type CaissierCreateFormData = z.infer<typeof caissierCreateSchema>;
export type CaissierEditFormData = z.infer<typeof caissierEditSchema>;
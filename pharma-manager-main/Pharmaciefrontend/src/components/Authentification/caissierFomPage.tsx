import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, UserPlus, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCaissiers } from "@/hooks/useCaissiers";
import {
  caissierCreateSchema,
  type CaissierCreateFormData,
} from "@/Schemas/caissier";
import { toast } from "sonner";

export default function CaissierFormPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // ✅ detect edit mode
  const isEdit = !!id;

  const { addCaissier, updateCaissier, getCaissierById, submitting } = useCaissiers();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<CaissierCreateFormData>({
    resolver: zodResolver(caissierCreateSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  // ✅ LOAD DATA IN EDIT MODE
  useEffect(() => {
    if (isEdit && id) {
      getCaissierById(id).then((data) => {
        form.reset({
          username: data.username,
          email: data.email,
          password: "",
          confirm_password: "",
        });
      });
    }
  }, [id]);

  const handleSubmit = async (data: CaissierCreateFormData) => {
    try {
      if (isEdit && id) {
        await updateCaissier(id, {
          username: data.username,
          email: data.email,
          password: data.password || undefined, // optional
        });
         toast.success("Caissier mis à jour avec succès ");
      } else {
        await addCaissier({
          username: data.username,
          email: data.email,
          password: data.password,
        });
          toast.success("Caissier créé avec succès ");
      }

      navigate("/caissiers");
    } catch (err: any) {
      const detail = err?.response?.data;

      if (detail?.username) {
        form.setError("username", { message: detail.username[0] });
      } else if (detail?.email) {
        form.setError("email", { message: detail.email[0] });
      } else {
        form.setError("root", {
          message: "Une erreur est survenue. Veuillez réessayer.",
        });
         toast.error("Erreur lors de l'opération ");
      }
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-lg mx-auto">
      <Button variant="ghost" size="sm" onClick={() => navigate("/caissiers")}>
        <ArrowLeft className="h-4 w-4 mr-1" />
        Retour aux utilisateurs
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <UserPlus className="h-5 w-5 text-teal-500" />
            {isEdit ? "Modifier caissier" : "Nouveau caissier"}
          </CardTitle>
          {!isEdit && (
            <p className="text-sm text-muted-foreground">
              Le compte sera créé avec le rôle{" "}
              <span className="font-medium text-teal-600">Caissier</span>{" "}
              automatiquement.
            </p>
          )}
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">

              {/* Root error */}
              {form.formState.errors.root && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">
                  {form.formState.errors.root.message}
                </div>
              )}

              {/* Username */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom d'utilisateur</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          {showPassword ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm */}
              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmer</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirm ? "text" : "password"}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          {showConfirm ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={submitting} className="flex-1">
                  {submitting
                    ? isEdit
                      ? "Modification..."
                      : "Création..."
                    : isEdit
                    ? "Mettre à jour"
                    : "Créer"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/caissiers")}
                >
                  Annuler
                </Button>
              </div>

            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Plus, Trash2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useVentes } from "@/hooks/useVentes";
import { useMedicaments } from "@/hooks/useMedicaments";
import { venteSchema, type VenteFormData } from "@/Schemas/vente";

export default function VenteFormPage() {
  const navigate = useNavigate();
  const { addVente, submitting } = useVentes({});
  const { medicaments } = useMedicaments({
    search: "",
    categorie: "",
    ordonnance_requise: "",
    est_en_alerte: "",
  });

  let _keyCounter = 0;

  const form = useForm<VenteFormData>({
    resolver: zodResolver(venteSchema) as Resolver<VenteFormData>,
    defaultValues: {
      notes: "",
      lignes: [{ _key: ++_keyCounter, medicament: "" as any, quantite: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lignes",
  });

  const addLigne = () =>
    append({ _key: ++_keyCounter, medicament: "" as any, quantite: 1 });

  const handleSubmit = async (data: VenteFormData) => {
    try {
      await addVente({
        notes: data.notes ?? "",
        lignes: data.lignes.map((l) => ({
          medicament: l.medicament as number,
          quantite: l.quantite,
        })),
      });
      toast.success("Vente enregistrée avec succès.");
      navigate("/ventes");
    } catch (err: any) {
      // Surface backend errors — stock insuffisant, médicament inactif, etc.
      const detail = err?.response?.data;
      if (detail?.stock) {
        toast.error(detail.stock, { duration: 7000 });
      } else if (detail?.medicament) {
        toast.error(detail.medicament, { duration: 7000 });
      } else if (detail?.detail) {
        toast.error(detail.detail, { duration: 7000 });
      } else {
        toast.error("Erreur lors de la création de la vente. Veuillez réessayer.");
      }
    }
  };

  const watchedLignes = form.watch("lignes");

  const total = watchedLignes.reduce((acc, ligne) => {
    if (!ligne.medicament) return acc;
    const med = medicaments.find((m) => m.id === Number(ligne.medicament));
    return acc + (med ? Number(med.prix_vente) * (ligne.quantite || 0) : 0);
  }, 0);

  return (
    <div className="space-y-6 p-6 max-w-3xl mx-auto">
      <Button variant="ghost" size="sm" onClick={() => navigate("/ventes")}>
        <ArrowLeft className="h-4 w-4 mr-1" />
        Retour aux ventes
      </Button>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">

          {/* Notes card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-teal-500" />
                Nouvelle vente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Notes{" "}
                      <span className="text-slate-400 font-normal">(optionnel)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Remarques, informations complémentaires..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Lignes card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  Articles
                  <Badge variant="outline" className="ml-2 font-normal">
                    {fields.length} ligne{fields.length !== 1 ? "s" : ""}
                  </Badge>
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addLigne}
                  className="flex items-center gap-1.5 text-teal-600 border-teal-200 hover:bg-teal-50 hover:border-teal-300"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Ajouter une ligne
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">

              {/* Column headers */}
              <div className="grid grid-cols-[1fr_120px_36px] gap-3 px-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Médicament
                </span>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Quantité
                </span>
                <span />
              </div>

              {fields.map((field, index) => {
                const watchedMed = watchedLignes[index]?.medicament;
                const selectedMed = medicaments.find(
                  (m) => m.id === Number(watchedMed)
                );
                const sousTotal =
                  selectedMed && watchedLignes[index]?.quantite
                    ? Number(selectedMed.prix_vente) * watchedLignes[index].quantite
                    : null;

                return (
                  <div key={field.id} className="space-y-1">
                    <div className="grid grid-cols-[1fr_120px_36px] gap-3 items-start">

                      {/* Medicament */}
                      <Controller
                        control={form.control}
                        name={`lignes.${index}.medicament`}
                        render={({ field: f, fieldState }) => (
                          <div className="space-y-1">
                            <Select
                              value={f.value ? String(f.value) : ""}
                              onValueChange={(v) => f.onChange(Number(v))}
                            >
                              <SelectTrigger
                                className={fieldState.error ? "border-destructive" : ""}
                              >
                                <SelectValue placeholder="Sélectionner un médicament" />
                              </SelectTrigger>
                              <SelectContent>
                                {medicaments.map((med) => (
                                  <SelectItem key={med.id} value={String(med.id)}>
                                    <span className="flex items-center gap-3">
                                      <span>{med.nom}</span>
                                      <span className="text-slate-400 text-xs">
                                        {med.dosage}
                                      </span>
                                    </span>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {fieldState.error && (
                              <p className="text-xs text-destructive">
                                {fieldState.error.message}
                              </p>
                            )}
                          </div>
                        )}
                      />

                      {/* Quantity */}
                      <Controller
                        control={form.control}
                        name={`lignes.${index}.quantite`}
                        render={({ field: f, fieldState }) => (
                          <div className="space-y-1">
                            <Input
                              type="number"
                              min={1}
                              value={f.value}
                              onChange={(e) =>
                                f.onChange(Math.max(1, e.target.valueAsNumber || 1))
                              }
                              className={`text-center ${fieldState.error ? "border-destructive" : ""}`}
                            />
                            {fieldState.error && (
                              <p className="text-xs text-destructive">
                                {fieldState.error.message}
                              </p>
                            )}
                          </div>
                        )}
                      />

                      {/* Remove */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={fields.length === 1}
                        onClick={() => remove(index)}
                        className="h-9 w-9 text-slate-400 hover:text-destructive disabled:opacity-30 mt-0.5"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Sous-total preview */}
                    {sousTotal !== null && (
                      <p className="text-xs text-slate-400 pl-1">
                        {Number(selectedMed!.prix_vente).toLocaleString("fr-MA", {
                          style: "currency",
                          currency: "MAD",
                        })}{" "}
                        × {watchedLignes[index].quantite} ={" "}
                        <span className="text-slate-600 font-medium">
                          {sousTotal.toLocaleString("fr-MA", {
                            style: "currency",
                            currency: "MAD",
                          })}
                        </span>
                      </p>
                    )}
                  </div>
                );
              })}

              {/* Lignes-level error */}
              {form.formState.errors.lignes?.message && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.lignes.message}
                </p>
              )}

              {/* Total preview */}
              {total > 0 && (
                <div className="flex justify-end pt-3 border-t border-slate-100">
                  <div className="text-right">
                    <p className="text-xs text-slate-400 uppercase tracking-wide">
                      Total estimé TTC
                    </p>
                    <p className="text-xl font-bold text-slate-800">
                      {total.toLocaleString("fr-MA", {
                        style: "currency",
                        currency: "MAD",
                      })}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button type="submit" disabled={submitting} className="button-custom">
              {submitting ? "Enregistrement..." : "Enregistrer la vente"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/ventes")}
            >
              Annuler
            </Button>
          </div>

        </form>
      </Form>
    </div>
  );
}
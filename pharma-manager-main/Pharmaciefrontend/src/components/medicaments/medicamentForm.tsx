import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
import { medicamentSchema, type MedicamentFormData } from "@/Schemas/medicament";
import type { Medicament } from "@/api/medicamentApi";
import type { Categorie } from "@/api/categoriesApi";
import { toast } from "sonner";

interface MedicamentFormProps {
  categories: Categorie[];
  onSubmit: (payload: MedicamentFormData) => Promise<Medicament>;
  submitting: boolean;
  editingItem: Medicament | null;
  onCancelEdit: () => void;
}

export default function MedicamentForm({
  categories,
  onSubmit,
  submitting,
  editingItem,
  onCancelEdit,
}: MedicamentFormProps) {
  const form = useForm<MedicamentFormData>({
    resolver: zodResolver(medicamentSchema) as Resolver<MedicamentFormData>,
    defaultValues: {
      nom: "",
      dci: "",
      categorie: undefined,
      forme: "",
      dosage: "",
      prix_achat: undefined,
      prix_vente: undefined,
      stock_actuel: undefined,
      stock_minimum: undefined,
      date_expiration: "",
      ordonnance_requise: false,
      est_actif: true,
    },
  });
  const {setError}=form;

  useEffect(() => {
    if (editingItem && categories.length > 0){
      form.reset({
        nom: editingItem.nom,
        dci: editingItem.dci,
        categorie: editingItem.categorie,
        forme: editingItem.forme,
        dosage: editingItem.dosage,
        prix_achat: editingItem.prix_achat,
        prix_vente: editingItem.prix_vente,
        stock_actuel: editingItem.stock_actuel,
        stock_minimum: editingItem.stock_minimum,
        date_expiration: editingItem.date_expiration,
        ordonnance_requise: editingItem.ordonnance_requise,
        est_actif: editingItem.est_actif,
      });
     } 
    else {
      form.reset();
    }
  }, [editingItem,categories, form]);



  const handleSubmit = async (data: MedicamentFormData) => {
      try {
    await onSubmit(data);

    toast.success("Médicament enregistré avec succès ✅");
    form.reset();

  } catch (error: any) {
    const backendErrors = error?.response?.data;

   if (backendErrors) {
  let firstMessage = "Erreur de validation ❌";

  Object.keys(backendErrors).forEach((field, index) => {
    const msg = backendErrors[field][0];

    setError(field as keyof MedicamentFormData, {
      type: "server",
      message: msg,
    });
    if (index === 0) {
      firstMessage = msg;
    }
  });

  toast.error(firstMessage);
}
  }
};

  

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">

        {/* ── Section: Identification ── */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Identification
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="nom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom du médicament" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dci"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DCI</FormLabel>
                  <FormControl>
                    <Input placeholder="Dénomination commune internationale" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categorie"
              render={({ field }) => 
              {
              console.log("editingItem.categorie:", editingItem?.categorie);
             console.log("field.value:", field.value);
              console.log("categories:", categories);
              return(
                <FormItem>
                  <FormLabel>Catégorie</FormLabel>
                  <Select
                    key={field.value} 
                    value={field.value ? String(field.value) : undefined}
                    onValueChange={(val) => field.onChange(Number(val))}

                  >
                    
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>
                          {cat.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}}
            />
            <FormField
              control={form.control}
              name="forme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Forme</FormLabel>
                  <FormControl>
                    <Input placeholder="Comprimé, Sirop, Injection..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dosage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dosage</FormLabel>
                  <FormControl>
                    <Input placeholder="500mg, 250ml..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* ── Section: Prix ── */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Prix
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="prix_achat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prix d'achat</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.replace(",", ".");
                        field.onChange(Number(value))}}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="prix_vente"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prix de vente</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      placeholder="0.00"
                      {...field}
                    
                      onChange={(e) => {
                        const value = e.target.value.replace(",", ".");
                        field.onChange(Number(value))}}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* ── Section: Stock ── */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Stock
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="stock_actuel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock actuel</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock_minimum"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock minimum</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date_expiration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date d'expiration</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* ── Section: Options ── */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Options
          </h3>
          <div className="flex flex-col sm:flex-row gap-6">
            <FormField
              control={form.control}
              name="ordonnance_requise"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">Ordonnance requise</FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="est_actif"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">Médicament actif</FormLabel>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={submitting} className="button-custom">
            {submitting
              ? "Enregistrement..."
              : editingItem
              ? "Enregistrer les modifications"
              : "Ajouter le médicament"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancelEdit}>
            Annuler
          </Button>
        </div>

      </form>
    </Form>
  );
}

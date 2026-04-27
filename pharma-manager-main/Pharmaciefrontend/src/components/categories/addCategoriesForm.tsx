import { useEffect } from "react";
import { useForm,type Resolver } from "react-hook-form";
import { zodResolver  } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { categorieSchema, type CategorieFormData } from "@/Schemas/categorie";

export default function CategorieForm({
  onSubmit,
  submitting,
  editingItem,
  onCancel,
}: {
  onSubmit: (data: CategorieFormData) => Promise<void>;
  submitting: boolean;
  editingItem: any;
  onCancel: () => void;
}) {
  const form = useForm<CategorieFormData>({
    resolver:zodResolver(categorieSchema) as Resolver<CategorieFormData>,
    defaultValues: {
      nom: "",
      description: "",
    },
  });

  useEffect(() => {
    if (editingItem) {
      form.reset({
        nom: editingItem.nom,
        description: editingItem.description ?? "",
      });
    } else {
      form.reset({ nom: "", description: "" });
    }
  }, [editingItem, form]);

  const handleSubmit = async (data: CategorieFormData) => {
    await onSubmit(data);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">

        {/* Nom */}
        <FormField
          control={form.control}
          name="nom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de la catégorie</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Antibiotiques" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Description{" "}
                <span className="text-slate-400 font-normal">(optionnel)</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Description de la catégorie..."
                  rows={3}
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={submitting} className="button-custom">
            {submitting
              ? "Enregistrement..."
              : editingItem
              ? "Modifier"
              : "Ajouter"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
        </div>

      </form>
    </Form>
  );
}

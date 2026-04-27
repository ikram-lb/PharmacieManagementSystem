import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useCategories } from "@/hooks/useCategories";
import CategorieForm from "@/components/categories/addCategoriesForm";
import type { Categorie } from "@/api/categoriesApi";

export default function CategorieFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const editingItem =
    (location.state as { categorie?: Categorie } | null)?.categorie ?? null;
  const isEditing = Boolean(id && editingItem);

  const { addCategorie, editCategorie, submitting } = useCategories();

  const handleSubmit = async (data: any) => {
    try {
      if (isEditing && editingItem) {
        await editCategorie(editingItem.id, data);
        toast.success("Catégorie modifiée avec succès.");
      } else {
        await addCategorie(data);
        toast.success("Catégorie ajoutée avec succès.");
      }
      navigate("/categories");
    } catch (err: any) {
      const status = err?.response?.status;
      const detail = err?.response?.data;

      // Django returns 400 with {nom: ["categorie with this nom already exists."]}
      // for unique constraint violations
      if (
        status === 400 &&
        (detail?.nom?.[0]?.toLowerCase().includes("already exist") ||
          detail?.nom?.[0]?.toLowerCase().includes("existe déjà") ||
          detail?.nom?.[0]?.toLowerCase().includes("unique"))
      ) {
        toast.warning(`La catégorie "${data.nom}" existe déjà.`, {
          duration: 5000,
        });
      } else if (status === 400 && detail?.nom) {
        toast.error(detail.nom[0]);
      } else {
        toast.error("Erreur lors de l'enregistrement. Veuillez réessayer.");
      }
    }
  };

  const handleCancel = () => navigate("/categories");

  return (
    <div className="space-y-6 p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={handleCancel}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour aux catégories
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            {isEditing ? "Modifier la catégorie" : "Ajouter une catégorie"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CategorieForm
            onSubmit={handleSubmit}
            submitting={submitting}
            editingItem={editingItem}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </div>
  );
}
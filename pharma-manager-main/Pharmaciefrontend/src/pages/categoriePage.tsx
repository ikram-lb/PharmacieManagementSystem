import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Layers, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import PageHeader from "@/components/common/PageHeader";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";
import ErrorAlert from "@/components/common/ErrorAlert";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useCategories } from "@/hooks/useCategories";
import type { Categorie } from "@/api/categoriesApi";

export default function CategoriesPage() {
  const navigate = useNavigate();
  const { categories, loading, error, submitting, removeCategorie } =
    useCategories();
  const [deleteTarget, setDeleteTarget] = useState<Categorie | null>(null);

  const handleEdit = (cat: Categorie) => {
    navigate(`/categories/${cat.id}/edit`, { state: { categorie: cat } });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const name = deleteTarget.nom;
    try {
      await removeCategorie(deleteTarget.id);
      toast.success(`Catégorie "${name}" supprimée.`);
      setDeleteTarget(null);
    } catch (err: any) {
      setDeleteTarget(null);
      const status = err?.response?.status;
      const detail = err?.response?.data?.detail;

      if (status === 500 || status === 409) {
        toast.error(
          `Impossible de supprimer "${name}" : cette catégorie contient des médicaments. Retirez-les d'abord.`,
          { duration: 7000 }
        );
      } else if (detail) {
        toast.error(detail, { duration: 6000 });
      } else {
        toast.error("Une erreur est survenue lors de la suppression.");
      }
    }
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Catégories"
        subtitle={`Total : ${categories.length}`}
        action={
          <Button onClick={() => navigate("/categories/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter catégorie
          </Button>
        }
      />

      {error && <ErrorAlert message={getErrorMessage(error)} />}

      <Card>
        <CardContent className="p-4">
          {loading ? (
            <LoadingSpinner message="Chargement..." />
          ) : categories.length === 0 ? (
            <EmptyState message="Aucune catégorie trouvée." />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="relative border rounded-lg p-4 bg-white hover:shadow-md transition-shadow duration-200"
                >
                  {/* Action buttons — always visible */}
                  <div className="absolute top-3 right-3 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleEdit(cat)}
                      className="p-1.5 rounded-md text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                      title="Modifier"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(cat)}
                      className="p-1.5 rounded-md text-slate-400 hover:text-destructive hover:bg-red-50 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex items-center gap-2 mb-2 pr-16">
                    <Layers className="h-4 w-4 text-teal-500 shrink-0" />
                    <h3 className="font-semibold text-slate-800 truncate">
                      {cat.nom}
                    </h3>
                  </div>

                  <p className="text-sm text-slate-500 mb-3 line-clamp-2">
                    {cat.description || "Aucune description"}
                  </p>

                  <div className="flex justify-between text-sm border-t border-slate-100 pt-3">
                    <div>
                      <p className="text-slate-400 text-xs">Médicaments</p>
                      <p className="font-medium text-slate-700">
                        {cat.nb_medicaments ?? 0}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400 text-xs">Quantité totale</p>
                      <p className="font-medium text-slate-700">
                        {cat.quantite_totale ?? 0}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la catégorie ?</AlertDialogTitle>
            <AlertDialogDescription>
              Vous êtes sur le point de supprimer{" "}
              <span className="font-semibold text-slate-800">
                {deleteTarget?.nom}
              </span>
              .{" "}
              {(deleteTarget?.nb_medicaments ?? 0) > 0 ? (
                <span className="text-amber-600 font-medium">
                  ⚠️ Cette catégorie contient {deleteTarget?.nb_medicaments}{" "}
                  médicament{(deleteTarget?.nb_medicaments ?? 0) > 1 ? "s" : ""} —
                  la suppression sera bloquée si des médicaments y sont encore associés.
                </span>
              ) : (
                "Cette action est irréversible."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={submitting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {submitting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

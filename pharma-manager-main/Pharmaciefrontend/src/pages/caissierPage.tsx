import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { useCaissiers, type Caissier } from "@/hooks/useCaissiers";

export default function CaissiersPage() {
  const navigate = useNavigate();
  const { caissiers, count, loading, error, submitting, removeCaissier } =
    useCaissiers();
  const [deleteTarget, setDeleteTarget] = useState<Caissier | null>(null);

  const handleEdit = (caissier: Caissier) => {
    navigate(`/caissiers/${caissier.id}/edit`, { state: { caissier } });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const username = deleteTarget.username;
    try {
      await removeCaissier(deleteTarget.id);
      // React Query invalidates ["caissiers"] on success → list refreshes automatically
      toast.success(`Compte de "${username}" supprimé.`);
      setDeleteTarget(null);
    } catch (err: any) {
      setDeleteTarget(null);
      toast.error("Impossible de  supprimer ce compte. . Veuillez réessayer.");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Utilisateurs"
        subtitle={`${count} caissier${count !== 1 ? "s" : ""} enregistré${count !== 1 ? "s" : ""}`}
        action={
          <Button onClick={() => navigate("/caissiers/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un caissier
          </Button>
        }
      />

      {error && <ErrorAlert message={getErrorMessage(error)} />}

      <Card>
        <CardContent className="p-4">
          {loading ? (
            <LoadingSpinner message="Chargement des utilisateurs..." />
          ) : caissiers.length === 0 ? (
            <EmptyState message="Aucun caissier enregistré." />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {caissiers.map((caissier) => (
                <div
                  key={caissier.id}
                  className="relative flex items-start gap-3 border rounded-lg p-4 bg-white hover:shadow-sm transition-shadow duration-200"
                >
                  {/* Avatar */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600 font-semibold text-sm">
                    {caissier.username.slice(0, 2).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-slate-800 truncate">
                        {caissier.username}
                      </p>
                      <Badge className="bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-50 text-xs shrink-0">
                        Caissier
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-500 truncate mt-0.5">
                      {caissier.email || "—"}
                    </p>
                  </div>

                  {/* Action buttons — always visible */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEdit(caissier)}
                      className="p-1.5 rounded-md text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                      title="Modifier"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(caissier)}
                      className="p-1.5 rounded-md text-slate-400 hover:text-destructive hover:bg-red-50 transition-colors"
                      title="Supprimer le compte"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
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
            <AlertDialogTitle>Supprimer ce compte ?</AlertDialogTitle>
            <AlertDialogDescription>
              Le compte de{" "}
              <span className="font-semibold text-slate-800">
                {deleteTarget?.username}
              </span>{" "}
              sera définitivement supprimé. Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={submitting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {submitting ? "Suppression....." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

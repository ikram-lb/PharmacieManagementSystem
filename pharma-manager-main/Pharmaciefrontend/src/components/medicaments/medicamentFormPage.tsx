import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MedicamentForm from "@/components/medicaments/medicamentForm";
import { useCategories } from "@/hooks/useCategories";
import { useMedicaments } from "@/hooks/useMedicaments";
import type { Medicament } from "@/api/medicamentApi";
import type { MedicamentFormData } from "@/Schemas/medicament";
import { toast } from "sonner";

export default function MedicamentFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  // The edit item is passed via router state from the table page
  // so we don't need a separate GET request for the item
  const editingItem = (location.state as { medicament?: Medicament } | null)
    ?.medicament ?? null;

  const isEditing = Boolean(id && editingItem);

  const { categories } = useCategories();

  // We only need addMedicament / editMedicament from the hook here.
  // Pass empty filters — this page doesn't render the list.
  const { submitting, addMedicament, editMedicament } = useMedicaments({
    search: "",
    categorie: "",
    ordonnance_requise: "",
    est_en_alerte: "",
  });

  const handleSubmit = async (payload: MedicamentFormData): Promise<Medicament> => {
    if (isEditing && editingItem) {
      const result = await editMedicament(editingItem.id, payload);
      if (result) {
      toast.info("Médicament modifié avec succès..");                         
      navigate("/medicaments");}
      return result;
    }
    
    const result = await addMedicament(payload);
    if (result) navigate("/medicaments");
    return result;
  };

  const handleCancel = () => {
    navigate("/medicaments");
  };

  return (
    <div className="space-y-6 p-6 max-w-3xl mx-auto">
      {/* Back navigation */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={handleCancel}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour aux médicaments
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            {isEditing ? "Modifier le médicament" : "Ajouter un médicament"}
          </CardTitle>
          {isEditing && editingItem && (
            <p className="text-sm text-muted-foreground mt-1">
              Modification de : <span className="font-medium">{editingItem.nom}</span>
            </p>
          )}
        </CardHeader>
        <CardContent>
          <MedicamentForm
            categories={categories}
            onSubmit={handleSubmit}
            submitting={submitting}
            editingItem={editingItem}
            onCancelEdit={handleCancel}
          />
        </CardContent>
      </Card>
    </div>
  );
}

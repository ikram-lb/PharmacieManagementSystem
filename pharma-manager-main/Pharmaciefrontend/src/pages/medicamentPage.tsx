import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ErrorAlert from "@/components/common/ErrorAlert";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import { useCategories } from "@/hooks/useCategories";
import { useMedicaments } from "@/hooks/useMedicaments";
import { getErrorMessage } from "@/utils/getErrorMessage";
import type { Medicament } from "@/api/medicamentApi";
import MedicamentFilters from "@/components/medicaments/medicamentFilters";
import { DataTable } from "@/components/common/Data-Table";
import { getColumns } from "@/components/Columns/ColumnsMedicament";
import { useAuth } from "@/context/AuthContext";

type Filters = {
  search: string;
  categorie: string;
  ordonnance_requise: string;
  est_en_alerte: string;
};

const initialFilters: Filters = {
  search: "",
  categorie: "",
  ordonnance_requise: "",
  est_en_alerte: "",
};

export default function MedicamentsPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const { categories: categoriesData } = useCategories();
  const { isDoctorAdmin, user, logout } = useAuth();

  const {
    medicaments,
    count,
    loading,
    error,
    removeMedicament,
  } = useMedicaments(filters);

  const handleFilterChange = (field: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleResetFilters = () => setFilters(initialFilters);

  // Navigate to dedicated add page
  const handleAdd = () => {
    navigate("/medicaments/new");
  };

  // Navigate to dedicated edit page, passing the item via router state
  const handleEdit = (item: Medicament) => {
    navigate(`/medicaments/${item.id}/edit`, { state: { medicament: item } });
  };

  const handleDelete = async (id: number): Promise<void> => {
    await removeMedicament(id);
  };

  const columns = getColumns(handleEdit, handleDelete);

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Médicaments"
        subtitle={`Total des médicaments : ${count}`}
        action={
          isDoctorAdmin &&
          <Button className="" onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un médicament
          </Button>
          
         
        }
      />

      {error && <ErrorAlert message={getErrorMessage(error)} />}

      {/* FILTERS */}
      <Card>
        <CardContent className="p-4">
          <MedicamentFilters
            filters={filters}
            categories={categoriesData}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <CardContent className="p-4">
          {loading ? (
            <LoadingSpinner message="Chargement des médicaments..." />
          ) : medicaments.length === 0 ? (
            <EmptyState message="Aucun médicament trouvé." />
          ) : (
            <DataTable columns={columns} data={medicaments} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

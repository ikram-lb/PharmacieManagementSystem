import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ErrorAlert from "@/components/common/ErrorAlert";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import { getErrorMessage } from "@/utils/getErrorMessage";
import type { Vente } from "@/api/ventesApi";
import { useVentes } from "@/hooks/useVentes";
import { DataTable } from "@/components/common/Data-Table";
import { getColumnsVente } from "@/components/Columns/ColumnsVente";
import VenteFilters from "@/components/ventes/VenteFilters";


type Filters = {
  statut: string;
  date_debut: string;
  date_fin: string;
};

const initialFilters: Filters = {
  statut: "",
  date_debut: "",
  date_fin: ""
};

export default function VentesPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const {
    ventes,
    count,
    loading,
    error,
    submitting,
    annulerVente,
  } = useVentes(filters);

  const handleFilterChange = (field: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleResetFilters = () => setFilters(initialFilters);

  // Navigate to dedicated add page
  const handleAdd = () => {
    navigate("/ventes/new");
  };

  // Navigate to detail page, passing vente via router state
  const handleViewDetails = (item: Vente) => {
    navigate(`/ventes/${item.id}`, { state: { vente: item } });
  };

  // Cancel vente in place — no navigation needed
  const handleCancel = async (id: number) => {
    await annulerVente(id);
  };

  const columns = getColumnsVente(handleViewDetails, handleCancel);

  return (
    <div className="space-y-6 p-6 min-h-screen">
      <PageHeader
        title="Ventes"
        subtitle={`Total des ventes : ${count}`}
        action={
          <Button onClick={handleAdd} disabled={submitting}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle vente
          </Button>
        }
      />

      {error && <ErrorAlert message={getErrorMessage(error)} />}

      {/* FILTERS */}
      <Card className="w-full">
        <CardContent className="p-4 w-full">
          <VenteFilters
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card className="w-full">
        <CardContent className="p-4 w-full">
          {loading ? (
            <LoadingSpinner message="Chargement des ventes..." />
          ) : ventes.length === 0 ? (
            <EmptyState message="Aucune vente trouvée." />
          ) : (
            <DataTable columns={columns} data={ventes} />
            
          )}
        </CardContent>
      </Card>
    </div>
  );
}

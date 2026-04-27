import { Package, ShoppingCart, AlertTriangle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageHeader from "@/components/common/PageHeader";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorAlert from "@/components/common/ErrorAlert";
import { useDashboard } from "@/hooks/useDashboard";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { formatPrice, formatDate } from "@/utils/formatters";
import StatCard from "@/components/common/StatCard";
import { ventesColumns } from "@/components/Columns/ColumnsVentes";
import { DataTable } from "@/components/common/Data-Table";
import { alertsColumns } from "@/components/Columns/alertsColumns";
import type { Vente, VentePayload } from "@/api/ventesApi";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate();

const handleViewMore = (vente: Vente) => {
  navigate(`/ventes/`);
};
const columns = ventesColumns(handleViewMore);
  const { medicaments, ventes, alerts, isLoading, error } = useDashboard();

  if (isLoading) return <LoadingSpinner message="Chargement du tableau de bord..." />;
  if (error) return <ErrorAlert message={getErrorMessage(error)} />;

  const totalMedicaments = medicaments?.count ?? 0;
  const totalVentes = ventes?.count ?? 0;
  const totalAlerts = alerts?.length ?? 0;
  const totalRevenue = ventes?.results.reduce(
    (sum, v) => sum + Number(v.total_ttc),
    0
  ) ?? 0;

  const recentVentes = ventes?.results.slice(0, 5) ?? [];
  const alertMedicaments = alerts ?? [];
  const ventesData = ventes?.results ?? [];
  

  return (
    <div className="space-y-6 p-6 ">
      <PageHeader
        title="Tableau de bord"
        subtitle="Vue d'ensemble de la pharmacie"
      />

      {/* STAT CARDS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total médicaments"
          value={totalMedicaments}
          description="Dans l'inventaire"
          icon={<Package className="h-5 w-5" />}
        />

        <StatCard
          title="Total ventes"
          value={totalVentes}
          description="Toutes les ventes"
          icon={<ShoppingCart className="h-5 w-5" />}
        />

        <StatCard
          title="Alertes stock"
          value={totalAlerts}
          description="Médicaments en rupture"
          icon={<AlertTriangle className="h-5 w-5" />}
          variant={totalAlerts > 0 ? "destructive" : "default"}
        />

        <StatCard
          title="Chiffre d'affaires"
          value={formatPrice(totalRevenue)}
          description="Total des ventes"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* RECENT VENTES */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ventes récentes</CardTitle>
          </CardHeader>
          <CardContent>
            {recentVentes.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Aucune vente enregistrée.
              </p>
            ) : (
              <DataTable columns={columns} data={ventesData} />
            )}
          </CardContent>
        </Card>

        {/* STOCK ALERTS */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Alertes de stock</CardTitle>
          </CardHeader>
          <CardContent>
            {alertMedicaments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Aucune alerte de stock.
              </p>
            ) : (
             <DataTable columns={alertsColumns} data={alertMedicaments} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
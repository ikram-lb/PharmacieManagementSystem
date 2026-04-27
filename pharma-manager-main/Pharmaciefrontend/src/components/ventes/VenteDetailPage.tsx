import { useNavigate, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, ShoppingCart, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Vente, VenteStatut } from "@/api/ventesApi";
import { useVentes } from "@/hooks/useVentes";

function StatutBadge({ statut }: { statut: VenteStatut }) {
  switch (statut) {
    case "COMPLETEE":
      return (
        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
          Complétée
        </Badge>
      );
    case "ANNULEE":
      return (
        <Badge className="bg-slate-100 text-slate-500 hover:bg-slate-100">
          Annulée
        </Badge>
      );
    default:
      return <Badge variant="outline">{statut}</Badge>;
  }
}

export default function VenteDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  // Read vente from router state (passed from VentesPage)
  const vente = (location.state as { vente?: Vente } | null)?.vente ?? null;

  const { submitting, annulerVente } = useVentes({});

  const handleCancel = async () => {
    if (!vente) return;
    await annulerVente(vente.id);
    navigate("/ventes");
  };

  // Redirect if no state (e.g. user refreshed)
  if (!vente) {
    return (
      <div className="p-6 space-y-4 max-w-3xl mx-auto">
        <Button variant="ghost" size="sm" onClick={() => navigate("/ventes")}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour aux ventes
        </Button>
        <Card>
          <CardContent className="p-8 text-center text-slate-400">
            <p className="text-sm">
              Détails non disponibles. Veuillez revenir à la liste.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isAnnulee = vente.statut === "ANNULEE";

  return (
    <div className="space-y-6 p-6 max-w-3xl mx-auto">

      {/* Back */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate("/ventes")}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour aux ventes
        </Button>
      </div>

      {/* Header card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-xl flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-teal-500" />
                {vente.reference}
              </CardTitle>
              <p className="text-sm text-slate-500">
                {new Date(vente.date_vente).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <StatutBadge statut={vente.statut} />
          </div>
        </CardHeader>
        {vente.notes && (
          <CardContent className="pt-0">
            <div className="flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2.5 text-sm text-slate-600">
              <FileText className="h-4 w-4 mt-0.5 shrink-0 text-slate-400" />
              {vente.notes}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Lignes card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Articles
            <Badge variant="outline" className="ml-2 font-normal">
              {vente.lignes_detail.length} ligne
              {vente.lignes_detail.length !== 1 ? "s" : ""}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-0 p-0">
          {/* Column header */}
          <div className="grid grid-cols-[1fr_80px_100px_110px] gap-3 px-6 py-2 bg-slate-50 border-y border-slate-100">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Médicament
            </span>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide text-center">
              Qté
            </span>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide text-right">
              Prix unit.
            </span>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide text-right">
              Sous-total
            </span>
          </div>

          {/* Rows */}
          {vente.lignes_detail.map((ligne, index) => (
            <div key={ligne.id}>
              <div className="grid grid-cols-[1fr_80px_100px_110px] gap-3 px-6 py-3.5 items-center">
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {ligne.medicament_nom}
                  </p>
                  <p className="text-xs text-slate-400">
                    {ligne.medicament_dosage}
                  </p>
                </div>
                <span className="text-sm text-slate-600 text-center">
                  {ligne.quantite}
                </span>
                <span className="text-sm text-slate-600 text-right">
                  {Number(ligne.prix_unitaire).toLocaleString("fr-MA", {
                    style: "currency",
                    currency: "MAD",
                  })}
                </span>
                <span className="text-sm font-semibold text-slate-800 text-right">
                  {Number(ligne.sous_total).toLocaleString("fr-MA", {
                    style: "currency",
                    currency: "MAD",
                  })}
                </span>
              </div>
              {index < vente.lignes_detail.length - 1 && (
                <Separator className="mx-6 w-auto" />
              )}
            </div>
          ))}

          {/* Total */}
          <div className="flex justify-end items-center gap-4 px-6 py-4 border-t border-slate-100 bg-slate-50">
            <span className="text-sm font-medium text-slate-500">Total TTC</span>
            <span className="text-2xl font-bold text-slate-900">
              {Number(vente.total_ttc).toLocaleString("fr-MA", {
                style: "currency",
                currency: "MAD",
              })}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      {!isAnnulee && (
        <div className="flex gap-3">
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={submitting}
          >
            {submitting ? "Annulation..." : "Annuler cette vente"}
          </Button>
          <Button variant="outline" onClick={() => navigate("/ventes")}>
            Retour
          </Button>
        </div>
      )}
    </div>
  );
}

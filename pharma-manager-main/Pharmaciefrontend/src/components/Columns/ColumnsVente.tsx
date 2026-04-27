import type { ColumnDef } from "@tanstack/react-table";
import type { Vente, VenteStatut } from "@/api/ventesApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

// ── Statut badge ──────────────────────────────────────────────
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

// ── Column definitions ────────────────────────────────────────
export const getColumnsVente = (
  onViewDetails: (item: Vente) => void,
  onCancel: (id: number) => void
): ColumnDef<Vente>[] => [
  {
    accessorKey: "reference",
    header: "Référence",
    cell: ({ row }) => (
      <span className="font-mono text-sm font-medium">
        {row.getValue("reference")}
      </span>
    ),
  },
  {
    accessorKey: "date_vente",
    header: "Date",
    cell: ({ row }) => {
      const raw = row.getValue<string>("date_vente");
      return (
        <span className="text-sm text-slate-600">
          {new Date(raw).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      );
    },
  },
  {
    accessorKey: "lignes_detail",
    header: "Articles",
    cell: ({ row }) => {
      const lignes = row.original.lignes_detail;
      return (
        <Badge variant="outline">
          {lignes.length} article{lignes.length !== 1 ? "s" : ""}
        </Badge>
      );
    },
  },
  {
    accessorKey: "total_ttc",
    header: "Total TTC",
    cell: ({ row }) => {
      const total = row.getValue<number>("total_ttc");
      return (
        <span className="font-semibold text-slate-800">
          {Number(total).toLocaleString("fr-MA", {
            style: "currency",
            currency: "MAD",
            minimumFractionDigits: 2,
          })}
        </span>
      );
    },
  },
  {
    accessorKey: "statut",
    header: "Statut",
    cell: ({ row }) => (
      <StatutBadge statut={row.getValue("statut")} />
    ),
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => {
      const notes = row.getValue<string>("notes");
      return notes ? (
        <span className="text-sm text-slate-500 truncate max-w-[160px] block">
          {notes}
        </span>
      ) : (
        <span className="text-slate-300 text-sm">—</span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const vente = row.original;
      const isAnnulee = vente.statut === "ANNULEE";

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Ouvrir le menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onViewDetails(vente)}>
              Voir les détails
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={isAnnulee}
              className="text-destructive focus:text-destructive disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={() => !isAnnulee && onCancel(vente.id)}
            >
              Annuler la vente
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

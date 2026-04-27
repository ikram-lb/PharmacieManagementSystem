import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge"; 
import { Button } from "../ui/button";
import type { Vente } from "@/api/ventesApi";
import type { ColumnDef } from "@tanstack/react-table";
import { formatDate, formatPrice } from "@/utils/formatters";

export const ventesColumns = (
  viewMore: (vente: Vente) => void
): ColumnDef<Vente>[] => [
  {
    accessorKey: "reference",
    header: "Référence",
  },
  {
    accessorKey: "date_vente",
    header: "Date",
    cell: ({ row }) => formatDate(row.getValue("date_vente")),
  },
  {
    accessorKey: "total_ttc",
    header: "Total",
    cell: ({ row }) => formatPrice(row.getValue("total_ttc")),
  },
  {
    accessorKey: "statut",
    header: "Statut",
    cell: ({ row }) => {
      const statut = row.getValue<string>("statut");

      return (
        <Badge
          variant={
            statut === "ANNULEE"
              ? "destructive"
              : statut === "COMPLETEE"
              ? "default"
              : "secondary"
          }
        >
          {statut}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const vente = row.original;

      return (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => viewMore(vente)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      );
    },
  },
];
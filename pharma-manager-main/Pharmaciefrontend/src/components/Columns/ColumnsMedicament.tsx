import type { ColumnDef } from "@tanstack/react-table";
import type { Medicament } from "@/api/medicamentApi";
import { formatDate, formatPrice } from "@/utils/formatters";
import { Badge } from "@/components/ui/badge";
import { createActionsColumn } from "./createActionsColumn";

export const getColumns = (
  onEdit: (item: Medicament) => void,
  onDelete: (id: number) => void
): ColumnDef<Medicament>[] => [
  {
    accessorKey: "nom",
    header: "Nom",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("nom")}</span>
    ),
  },
  {
    accessorKey: "categorie_nom", 
    header: "Catégorie",
    
  },
  {
    accessorKey: "dosage",
    header: "Dosage",
  },
  {
    accessorKey: "prix_vente",
    header: "Prix vente",
    cell: ({ row }) => formatPrice(Number(row.getValue("prix_vente"))),
  },
  {
    accessorKey: "stock_actuel",
    header: "Stock",
    cell: ({ row }) => {
      const stock = row.getValue<number>("stock_actuel");
      const min = row.original.stock_minimum;

      if (stock === 0) {
        return <Badge variant="destructive">{stock}</Badge>;
      }
      if (stock <= min) {
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            {stock}
          </Badge>
        );
      }
      return (
        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
          {stock}
        </Badge>
      );
    },
  },
  {
    accessorKey: "date_expiration",
    header: "Expiration",
    cell: ({ row }) => formatDate(String(row.getValue("date_expiration"))),
  },
  {
    accessorKey: "ordonnance_requise",
    header: "Ordonnance",
    cell: ({ row }) =>
      row.getValue("ordonnance_requise") ? (
        <Badge  className="bg-white text-bold">Requise</Badge>
      ) : (
        <Badge  className=" bg-white text-muted-foreground">
          Non requise
        </Badge>
      ),
  },
  {
    accessorKey: "est_en_alerte",
    header: "Alerte stock",
    cell: ({ row }) =>
      row.getValue("est_en_alerte") ? (
        <Badge variant="destructive">Alerte</Badge>
      ) : (
        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
          OK
        </Badge>
      ),
  },
  {
    accessorKey: "est_actif",
    header: "Statut",
    cell: ({ row }) =>
      row.getValue("est_actif") ? (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          Actif
        </Badge>
      ) : (
        <Badge variant="secondary" className="text-muted-foreground">
          Inactif
        </Badge>
      ),
  },
  createActionsColumn<Medicament>({
    onEdit,
    onDelete,
    getId: (item) => item.id,
  }),
];
import type { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@/utils/formatters";
import { Badge } from "@/components/ui/badge";

type AlertMedicament = {
  id: number;
  nom: string;
  stock_actuel: number;
  stock_minimum: number;
  date_expiration: string;
};

export const alertsColumns: ColumnDef<AlertMedicament>[] = [
  {
    accessorKey: "nom",
    header: "Médicament",
  },
  {
    accessorKey: "stock_actuel",
    header: "Stock actuel",
    cell: ({ row }) => (
      <Badge variant="destructive">
        {row.getValue("stock_actuel")}
      </Badge>
    ),
  },
  {
    accessorKey: "stock_minimum",
    header: "Stock minimum",
  },
  {
    accessorKey: "date_expiration",
    header: "Expiration",
    cell: ({ row }) => formatDate(row.getValue("date_expiration")),
  },
];
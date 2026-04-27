import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

type ActionsProps<T> = {
  onEdit?: (item: T) => Promise<void> | void;
  onDelete?: (id: number) => Promise<void> | void;
  getId: (item: T) => number;
};

export function createActionsColumn<T>({
  onEdit,
  onDelete,
  getId,
}: ActionsProps<T>): ColumnDef<T> {
  return {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const item = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            {onEdit && (
              <DropdownMenuItem
                onClick={async () => {
                  try {
                    await onEdit(item);
                  } catch {
                    toast.error("Erreur lors de la modification ❌");
                  }
                }}
              >
                Modifier
              </DropdownMenuItem>
            )}

            {onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={async () => {
                    try {
                      await onDelete(getId(item));
                      toast.success("Suppression réussie ✅");
                    } catch {
                      toast.error("Erreur lors de la suppression ❌");
                    }
                  }}
                >
                  Supprimer
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  };
}
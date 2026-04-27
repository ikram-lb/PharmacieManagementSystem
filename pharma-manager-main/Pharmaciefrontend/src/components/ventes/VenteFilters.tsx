import { SlidersHorizontal, RotateCcw, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { formatDate } from "@/utils/formatters";
import { addDays } from "date-fns/addDays";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";

type Filters = {
  statut: string;
  date_debut : string;
  date_fin : string;
};

type VenteFiltersProps = {
  filters: Filters;
  onChange: (field: keyof Filters, value: string) => void;
  onReset: () => void;
};

function countActiveFilters(filters: Filters): number {
  return [
    filters.date_debut ,
    filters.date_fin ,
    filters.statut && filters.statut !== "All" ? filters.statut : "",
  ].filter(Boolean).length;
}

export default function VenteFilters({
  filters,
  onChange,
  onReset,
}: VenteFiltersProps) {
  const activeCount = countActiveFilters(filters);

  return (
    <div className="space-y-3 w-full">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-600">Filtres</span>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-teal-600 hover:border-teal-300 transition-colors duration-150 group"
        >
          <RotateCcw className="h-3 w-3 group-hover:rotate-[-45deg] transition-transform duration-300" />
          Réinitialiser
        </Button>
      </div>

      {/* Controls */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">

  {/* Date début 
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium text-slate-500">
      Date début
    </label>
    <input
      type="date"
      value={filters.date_debut || ""}
      onChange={(e) => onChange("date_debut", e.target.value)}
      className="h-9 px-3 text-sm rounded-md border border-slate-200 bg-white
                 text-slate-700 shadow-sm
                 outline-none transition
                 focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
    />
  </div>
  

  {/* Date fin 
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium text-slate-500">
      Date fin
    </label>
    <input
      type="date"
      value={filters.date_fin || ""}
      onChange={(e) => onChange("date_fin", e.target.value)}
      className="h-9 px-3 text-sm rounded-md border border-slate-200 bg-white
                 text-slate-700 shadow-sm
                 outline-none transition
                 focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
    />
  </div>
  */}

     <div className="flex flex-col gap-1.5">
  <label className="text-xs font-medium text-slate-500">
    Date début
  </label>
  <Popover>
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        className="justify-start text-left font-normal h-9"
      >
        {filters.date_debut
          ? filters.date_debut
          : "Sélectionner une date"}
      </Button>
    </PopoverTrigger>

    <PopoverContent className="w-auto p-0">
      <Calendar
        mode="single"
        selected={
          filters.date_debut
            ? new Date(filters.date_debut)
            : undefined
        }
        onSelect={(d) =>
          onChange("date_debut", formatDate(d))
        }
        initialFocus
      />

      {/* Presets */}
      <div className="flex gap-2 p-2 border-t">
        {[0, 1, 3, 7].map((days) => (
          <Button
            key={days}
            size="sm"
            variant="outline"
            onClick={() => {
              const newDate = addDays(new Date(), days);
              onChange("date_debut", formatDate(newDate));
            }}
          >
            {days === 0 ? "Aujourd’hui" : `+${days}j`}
          </Button>
        ))}
      </div>
    </PopoverContent>
  </Popover>
</div>
<div className="flex flex-col gap-1.5">
  <label className="text-xs font-medium text-slate-500">
    Date Fin
  </label>

  <Popover>
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        className="justify-start text-left font-normal h-9"
      >
        {filters.date_fin
          ? filters.date_fin
          : "Sélectionner une date"}
      </Button>
    </PopoverTrigger>

    <PopoverContent className="w-auto p-0">
      <Calendar
        mode="single"
        selected={
          filters.date_fin
            ? new Date(filters.date_fin)
            : undefined
        }
        onSelect={(d) =>
          onChange("date_fin", formatDate(d))
        }
        initialFocus
      />

      {/* Presets */}
      <div className="flex gap-2 p-2 border-t">
        {[0, 1, 3, 7].map((days) => (
          <Button
            key={days}
            size="sm"
            variant="outline"
            onClick={() => {
              const newDate = addDays(new Date(), days);
              onChange("date_fin", formatDate(newDate));
            }}
          >
            {days === 0 ? "Aujourd’hui" : `+${days}j`}
          </Button>
        ))}
      </div>
    </PopoverContent>
  </Popover>
</div>

  {/* Statut */}
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium text-slate-500">
      Statut
    </label>

    <Select
      value={filters.statut}
      onValueChange={(v) => onChange("statut", v)}
    >
      <SelectTrigger
        className={[
          "h-9 text-sm rounded-md border bg-white shadow-sm transition",
          "focus:outline-none focus:ring-2 focus:ring-teal-100",
          filters.statut && filters.statut !== "All"
            ? "border-teal-400 ring-2 ring-teal-100 text-teal-700"
            : "border-slate-200 hover:border-slate-300 text-slate-600",
        ].join(" ")}
      >
        <SelectValue placeholder="Tous les statuts" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="All">Tous les statuts</SelectItem>
        <SelectItem value="COMPLETEE">Complétée</SelectItem>
        <SelectItem value="ANNULEE">Annulée</SelectItem>
      </SelectContent>
    </Select>
  </div>

</div>

      {/* Active filters */}
      {activeCount > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">

          {(filters.date_debut || filters.date_fin) && (
            <FilterPill
              label={`${filters.date_debut || "..."} → ${filters.date_fin || "..."}`}
              onRemove={() => {
                onChange("date_debut", "");
                onChange("date_fin", "");
              }}
            />
          )}

          {filters.statut && filters.statut !== "All" && (
            <FilterPill
              label={
                filters.statut === "COMPLETEE"
                  ? "Complétée"
                  : "Annulée"
              }
              onRemove={() => onChange("statut", "All")}
            />
          )}

        </div>
      )}

    </div>
  );
}

/* 🔹 OUTSIDE component */
function FilterPill({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-medium">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="rounded-full hover:bg-teal-200 p-0.5 transition-colors duration-100"
      >
        ✕
      </button>
    </span>
  );
}


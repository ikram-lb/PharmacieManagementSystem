import { Search, SlidersHorizontal, RotateCcw, Tag, FileText, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { Categorie } from "@/api/categoriesApi";

type Filters = {
  search: string;
  categorie: string;
  ordonnance_requise: string;
  est_en_alerte: string;
};

type MedicamentFiltersProps = {
  filters: Filters;
  categories: Categorie[];
  onChange: (field: keyof Filters, value: string) => void;
  onReset: () => void;
};

function countActiveFilters(filters: Filters): number {
  return [
    filters.search,
    filters.categorie && filters.categorie !== "All" ? filters.categorie : "",
    filters.ordonnance_requise && filters.ordonnance_requise !== "All"
      ? filters.ordonnance_requise
      : "",
    filters.est_en_alerte && filters.est_en_alerte !== "All"
      ? filters.est_en_alerte
      : "",
  ].filter(Boolean).length;
}

export default function MedicamentFilters({
  filters,
  categories,
  onChange,
  onReset,
}: MedicamentFiltersProps) {
  const activeCount = countActiveFilters(filters);

  return (
    <div className="space-y-3">

      {/* Header row */}
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

      {/* Filter controls */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">

  {/* Search */}
        <div className="relative group w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-teal-500 transition-colors duration-150 pointer-events-none" />
        <input
          type="text"
          placeholder="Nom, DCI, dosage…"
          value={filters.search}
          onChange={(e) => onChange("search", e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border bg-white
          placeholder:text-slate-400 text-slate-800
          outline-none transition-all duration-200
          border-slate-200 hover:border-slate-300 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 focus:shadow-sm"
        />
      </div>

          <div className="w-full">
        <FilterSelect
          value={filters.categorie}
          onValueChange={(v) => onChange("categorie", v)}
          icon={<Tag className="h-4 w-4" />}
          placeholder="Toutes les catégories"
          active={!!filters.categorie && filters.categorie !== "All"}
        >
          <SelectItem value="All">Toutes les catégories</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={String(cat.id)}>
              {cat.nom}
            </SelectItem>
          ))}
        </FilterSelect>
        </div>
        
        <div className="w-full">
        <FilterSelect
          value={filters.ordonnance_requise}
          onValueChange={(v) => onChange("ordonnance_requise", v)}
          icon={<FileText className="h-4 w-4" />}
          placeholder="Ordonnance"
          active={
            !!filters.ordonnance_requise &&
            filters.ordonnance_requise !== "All"
          }
        >
          <SelectItem value="All">Toutes</SelectItem>
          <SelectItem value="true">Avec ordonnance</SelectItem>
          <SelectItem value="false">Sans ordonnance</SelectItem>
        </FilterSelect>
        </div>

        <div className="w-full">
        <FilterSelect
          value={filters.est_en_alerte}
          onValueChange={(v) => onChange("est_en_alerte", v)}
          icon={<AlertTriangle className="h-4 w-4" />}
          placeholder="Stock"
          active={!!filters.est_en_alerte && filters.est_en_alerte !== "All"}
        >
          <SelectItem value="All">Tout le stock</SelectItem>
          <SelectItem value="true">En alerte</SelectItem>
          <SelectItem value="false">Stock normal</SelectItem>
        </FilterSelect>
         </div>
      </div>

      {activeCount > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {filters.search && (
            <FilterPill
              label={`"${filters.search}"`}
              onRemove={() => onChange("search", "")}
            />
          )}
          {filters.categorie && filters.categorie !== "All" && (
            <FilterPill
              label={
                categories.find((c) => String(c.id) === filters.categorie)
                  ?.nom ?? filters.categorie
              }
              onRemove={() => onChange("categorie", "")
              }
            />
          )}
          {filters.ordonnance_requise &&
            filters.ordonnance_requise !== "All" && (
              <FilterPill
                label={
                  filters.ordonnance_requise === "true"
                    ? "Avec ordonnance"
                    : "Sans ordonnance"
                }
                onRemove={() => onChange("ordonnance_requise", "")}
              />
            )}
          {filters.est_en_alerte && filters.est_en_alerte !== "All" && (
            <FilterPill
              label={
                filters.est_en_alerte === "true" ? "En alerte" : "Stock normal"
              }
              onRemove={() => onChange("est_en_alerte", "")}
            />
          )}
        </div>
      )}
    </div>
  );
}


function FilterSelect({
  value,
  onValueChange,
  icon,
  placeholder,
  active,
  children,
}: {
  value: string;
  onValueChange: (v: string) => void;
  icon: React.ReactNode;
  placeholder: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
          className={[
            "w-full text-sm rounded-lg border bg-white transition-all duration-200 gap-2",
            "focus:outline-none focus:ring-2 focus:ring-teal-100 focus:ring-offset-0",
            active
              ? "border-teal-400 ring-2 ring-teal-100 shadow-sm text-teal-700 font-medium"
              : "border-slate-200 hover:border-slate-300 text-slate-600",
          ].join(" ")}
        >
        <span className={`shrink-0 ${active ? "text-teal-500" : "text-slate-400"}`}>
          {icon}
        </span>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        {children}
      </SelectContent>
    </Select>
  );
}


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
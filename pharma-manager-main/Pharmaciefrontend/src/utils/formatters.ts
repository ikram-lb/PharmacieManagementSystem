export function formatPrice(value: number | string | null | undefined): string {
  const numericValue = Number(value ?? 0);

  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "MAD",
  }).format(numericValue);
}

// export function formatDate(value: string | Date | null | undefined): string {
//   if (!value) return "-";

//   return new Date(value).toLocaleDateString("fr-FR");
// }

export function formatDate(value?: Date | string | null): string {
  if (!value) return "";

  const date = typeof value === "string" ? new Date(value) : value;

  return date.toISOString().split("T")[0];
}

export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return "-";

  return new Date(value).toLocaleString("fr-FR");
}
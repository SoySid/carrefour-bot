export function formatCurrency(val: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(val);
}

export function formatFechaCorta(fechaIso: string): string {
  if (!fechaIso) return "";
  const parts = fechaIso.split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return fechaIso;
}

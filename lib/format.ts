export const fmtEUR = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

export const fmtPct = (n: number) =>
  `${n >= 0 ? "+" : ""}${n.toFixed(1)} %`;

export const fmtDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "2-digit" });
  } catch {
    return iso;
  }
};

export const statusLabel = (s: string) =>
  s === "stock" ? "En stock" : s === "listed" ? "En vente" : "Vendu";

export const categoryLabel = (c: string) =>
  c === "sneakers" ? "Sneakers" : c === "streetwear" ? "Streetwear" : "Accessoire";

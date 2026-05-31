"use client";
import { useState } from "react";
import { Plus, Filter } from "lucide-react";
import type { Item, Status } from "@/lib/types";
import { fmtEUR, fmtDate, statusLabel, categoryLabel } from "@/lib/format";
import { netSellRevenue } from "@/lib/compute";
import clsx from "clsx";

interface Props {
  items: Item[];
  onAdd: () => void;
  onEdit: (item: Item) => void;
}

export default function InventoryTable({ items, onAdd, onEdit }: Props) {
  const [filter, setFilter] = useState<Status | "all">("all");
  const filtered = filter === "all" ? items : items.filter((i) => i.status === filter);
  const sorted = [...filtered].sort((a, b) => (a.buyDate < b.buyDate ? 1 : -1));

  const statusChipClass = (s: Status) =>
    s === "stock"
      ? "bg-blue-500/15 text-blue-300 border-blue-500/20"
      : s === "listed"
      ? "bg-amber-500/15 text-amber-300 border-amber-500/20"
      : "bg-lime/15 text-lime border-lime/20";

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="font-display font-semibold text-base">Inventaire</div>
          <span className="text-xs text-muted">{items.length} pièces</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 text-xs">
            <Filter className="h-3.5 w-3.5 text-muted ml-2" />
            {(["all", "stock", "listed", "sold"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={clsx(
                  "px-2.5 py-1 rounded-md transition-colors",
                  filter === s ? "bg-white/10 text-text" : "text-muted hover:text-text"
                )}
              >
                {s === "all" ? "Tout" : statusLabel(s)}
              </button>
            ))}
          </div>
          <button className="btn btn-primary !py-2 !px-3 text-xs" onClick={onAdd}>
            <Plus className="h-4 w-4" /> Ajouter
          </button>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="py-16 text-center text-sm text-muted">Aucune pièce dans cette catégorie.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-muted">
                <th className="text-left font-medium px-5 py-3">Pièce</th>
                <th className="text-left font-medium px-3 py-3">Cat.</th>
                <th className="text-left font-medium px-3 py-3">Date</th>
                <th className="text-right font-medium px-3 py-3">Achat</th>
                <th className="text-right font-medium px-3 py-3">Marché / Vendu</th>
                <th className="text-right font-medium px-3 py-3">P&L</th>
                <th className="text-left font-medium px-5 py-3">Statut</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((it) => {
                const isSold = it.status === "sold";
                const net = isSold ? netSellRevenue(it) : 0;
                const pl = isSold ? net - it.buyPrice : it.marketPrice - it.buyPrice;
                return (
                  <tr
                    key={it.id}
                    onClick={() => onEdit(it)}
                    className="border-t border-white/5 hover:bg-white/[0.03] cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-text">{it.name}</div>
                      <div className="text-xs text-muted">
                        {it.brand}
                        {it.size ? ` · ${it.size}` : ""}
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-muted text-xs">{categoryLabel(it.category)}</td>
                    <td className="px-3 py-3.5 text-muted text-xs">{fmtDate(it.buyDate)}</td>
                    <td className="px-3 py-3.5 text-right numeric">{fmtEUR(it.buyPrice)}</td>
                    <td className="px-3 py-3.5 text-right numeric">
                      {isSold ? (
                        <span title={`Prix de vente : ${fmtEUR(it.sellPrice || 0)}`}>{fmtEUR(net)}</span>
                      ) : (
                        fmtEUR(it.marketPrice)
                      )}
                    </td>
                    <td
                      className={clsx(
                        "px-3 py-3.5 text-right numeric font-medium",
                        pl > 0 ? "text-lime" : pl < 0 ? "text-red-400" : "text-muted"
                      )}
                    >
                      {pl > 0 ? "+" : ""}
                      {fmtEUR(pl)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={clsx("chip border", statusChipClass(it.status))}>
                        {statusLabel(it.status)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

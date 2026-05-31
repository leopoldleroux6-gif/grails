"use client";
import { useState } from "react";
import { Flame, Clapperboard, TrendingUp, Sparkles, X, Loader2 } from "lucide-react";
import type { Item } from "@/lib/types";
import { fmtEUR, statusLabel, categoryLabel } from "@/lib/format";
import { netSellRevenue } from "@/lib/compute";

type AIType = "roast" | "caption" | "flip";

function inventorySummary(items: Item[]): string {
  if (items.length === 0) return "Inventaire vide.";
  const lines = items.map((i) => {
    const base = `- ${i.name} (${i.brand}, ${categoryLabel(i.category)}${i.size ? `, ${i.size}` : ""}) — acheté ${fmtEUR(i.buyPrice)} le ${i.buyDate}, statut: ${statusLabel(i.status)}`;
    if (i.status === "sold" && i.sellPrice != null) {
      const net = netSellRevenue(i);
      return `${base}, vendu ${fmtEUR(i.sellPrice)} (net ${fmtEUR(net)}) le ${i.sellDate} sur ${i.platform || "?"}`;
    }
    return `${base}, valeur marché estimée ${fmtEUR(i.marketPrice)}`;
  });
  return lines.join("\n");
}

function lastCopSummary(items: Item[]): string {
  const last = [...items]
    .filter((i) => i.status !== "sold")
    .sort((a, b) => (a.buyDate < b.buyDate ? 1 : -1))[0];
  if (!last) return "Aucune pièce récente.";
  return `Pièce : ${last.name} (${last.brand}, ${categoryLabel(last.category)}${last.size ? `, taille ${last.size}` : ""}). Achetée ${fmtEUR(last.buyPrice)} le ${last.buyDate}. Valeur marché estimée ${fmtEUR(last.marketPrice)}.`;
}

interface Props {
  items: Item[];
}

export default function AILab({ items }: Props) {
  const [open, setOpen] = useState<AIType | null>(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string>("");
  const [error, setError] = useState<string>("");

  async function run(type: AIType) {
    setOpen(type);
    setLoading(true);
    setResponse("");
    setError("");
    try {
      const userContent =
        type === "caption" ? lastCopSummary(items) : inventorySummary(items);
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ type, userContent }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Erreur");
      setResponse(data.text || "");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  const buttons = [
    {
      type: "roast" as const,
      title: "Roast ma collection",
      desc: "Claude balance un roast cinglant de ton inventaire.",
      icon: Flame,
      color: "from-orange-500/15 to-red-500/15 border-orange-500/20",
      iconColor: "text-orange-400",
    },
    {
      type: "caption" as const,
      title: "Caption TikTok",
      desc: "3 captions pour ta dernière pièce, prêtes à coller.",
      icon: Clapperboard,
      color: "from-violet/15 to-pink-500/15 border-violet/20",
      iconColor: "text-violet",
    },
    {
      type: "flip" as const,
      title: "Quelle pièce flip ?",
      desc: "Quoi vendre maintenant, quoi hold absolument.",
      icon: TrendingUp,
      color: "from-lime/15 to-emerald-500/15 border-lime/20",
      iconColor: "text-lime",
    },
  ];

  const titles: Record<AIType, string> = {
    roast: "Roast de ta collection",
    caption: "Captions TikTok",
    flip: "Recommandation flip / hold",
  };

  return (
    <>
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-lime/20 to-violet/20 border border-white/10 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-lime" />
            </div>
            <div>
              <div className="font-display font-semibold text-base">AI Lab</div>
              <div className="text-xs text-muted">Propulsé par Claude — en direct sur ton inventaire</div>
            </div>
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          {buttons.map((b) => (
            <button
              key={b.type}
              onClick={() => run(b.type)}
              className={`text-left rounded-2xl p-5 bg-gradient-to-br ${b.color} border hover:scale-[1.015] transition-transform`}
            >
              <b.icon className={`h-6 w-6 ${b.iconColor} mb-3`} />
              <div className="font-display font-semibold text-text mb-1">{b.title}</div>
              <div className="text-xs text-muted leading-relaxed">{b.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setOpen(null)}
        >
          <div
            className="card max-w-2xl w-full p-6 fade-up max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-lime" />
                <div className="font-display font-semibold text-lg">{titles[open]}</div>
              </div>
              <button onClick={() => setOpen(null)} className="text-muted hover:text-text">
                <X className="h-5 w-5" />
              </button>
            </div>
            {loading && (
              <div className="flex items-center gap-3 text-sm text-muted py-10 justify-center">
                <Loader2 className="h-4 w-4 animate-spin text-lime" />
                Claude réfléchit…
              </div>
            )}
            {error && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                {error}
              </div>
            )}
            {!loading && !error && response && (
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-text">{response}</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

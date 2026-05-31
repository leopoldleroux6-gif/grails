"use client";
import { Sparkles } from "lucide-react";
import { fmtEUR, fmtPct } from "@/lib/format";
import type { PortfolioStats } from "@/lib/compute";

export default function FlexCard({ stats }: { stats: PortfolioStats }) {
  const totalSold = stats.countByStatus.sold;
  return (
    <div className="flex-card rounded-2xl p-8 relative overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-lime flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-bg" strokeWidth={2.5} />
          </div>
          <div className="font-display font-bold text-lg tracking-tight">GRAILS</div>
        </div>
        <div className="text-[10px] text-muted uppercase tracking-wider">Mes stats reseller</div>
      </div>

      <div className="grid grid-cols-2 gap-y-7 gap-x-6">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted mb-1.5">Profit réalisé</div>
          <div className="font-display font-bold text-4xl text-lime numeric leading-none">
            {fmtEUR(stats.realizedProfit)}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted mb-1.5">ROI moyen</div>
          <div className="font-display font-bold text-4xl numeric leading-none">
            {fmtPct(stats.roiRealized)}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted mb-1.5">Portefeuille</div>
          <div className="font-display font-bold text-2xl numeric leading-none">
            {fmtEUR(stats.portfolioValue)}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted mb-1.5">Pièces flippées</div>
          <div className="font-display font-bold text-2xl numeric leading-none">
            {totalSold}
          </div>
        </div>
      </div>

      {stats.bestFlip && stats.bestFlip.profit > 0 && (
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="text-[10px] uppercase tracking-wider text-muted mb-1.5">Meilleur flip</div>
          <div className="flex items-center justify-between">
            <div className="font-display font-semibold text-base truncate pr-3">
              {stats.bestFlip.name}
            </div>
            <div className="text-lime font-semibold numeric text-base whitespace-nowrap">
              +{fmtEUR(stats.bestFlip.profit)}
            </div>
          </div>
        </div>
      )}

      <div className="absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-lime/10 blur-3xl pointer-events-none" />
      <div className="absolute -top-20 -left-20 h-48 w-48 rounded-full bg-violet/10 blur-3xl pointer-events-none" />
    </div>
  );
}

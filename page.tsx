"use client";
import { useMemo, useState } from "react";
import Header from "@/components/Header";
import KPICard from "@/components/KPICard";
import PortfolioChart from "@/components/PortfolioChart";
import CategoryDonut from "@/components/CategoryDonut";
import AILab from "@/components/AILab";
import InventoryTable from "@/components/InventoryTable";
import ItemModal from "@/components/ItemModal";
import FlexCard from "@/components/FlexCard";
import { useItems } from "@/lib/storage";
import { computeStats, profitTimeline } from "@/lib/compute";
import { fmtEUR, fmtPct } from "@/lib/format";
import type { Item } from "@/lib/types";

export default function Home() {
  const { items, setItems, loaded } = useItems();
  const [editing, setEditing] = useState<Item | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const stats = useMemo(() => computeStats(items), [items]);
  const timeline = useMemo(() => profitTimeline(items), [items]);

  function openAdd() {
    setEditing(null);
    setModalOpen(true);
  }
  function openEdit(it: Item) {
    setEditing(it);
    setModalOpen(true);
  }
  function save(it: Item) {
    setItems((prev) => {
      const exists = prev.find((p) => p.id === it.id);
      return exists ? prev.map((p) => (p.id === it.id ? it : p)) : [...prev, it];
    });
  }
  function remove(id: string) {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <main className="max-w-6xl mx-auto px-5 pb-24">
      <Header />

      {/* Hero */}
      <section className="mt-4 mb-10 fade-up">
        <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tight leading-[1.05]">
          Suis tes pièces.
          <br />
          Calcule tes flips. <span className="text-lime">Flex tes stats.</span>
        </h1>
        <p className="text-muted mt-4 max-w-xl text-[15px] leading-relaxed">
          GRAILS, c'est ton OS de reseller : portefeuille, P&amp;L, et un IA Lab propulsé par Claude qui te roast, te génère des captions TikTok et te dit quoi flip.
        </p>
      </section>

      {!loaded ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card p-5 h-[110px] shimmer" />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* KPIs */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <KPICard
              label="Portefeuille (valeur marché)"
              value={fmtEUR(stats.portfolioValue)}
              sub={`${stats.unrealizedPL >= 0 ? "+" : ""}${fmtEUR(stats.unrealizedPL)} latent`}
              positive={stats.unrealizedPL > 0}
              negative={stats.unrealizedPL < 0}
              accent
            />
            <KPICard
              label="Total investi (stock)"
              value={fmtEUR(stats.totalInvestedHeld)}
              sub={`${stats.countByStatus.stock + stats.countByStatus.listed} pièces en main`}
            />
            <KPICard
              label="Profit réalisé"
              value={fmtEUR(stats.realizedProfit)}
              sub={`${stats.countByStatus.sold} vente${stats.countByStatus.sold > 1 ? "s" : ""}`}
              positive={stats.realizedProfit > 0}
              negative={stats.realizedProfit < 0}
            />
            <KPICard
              label="ROI moyen (réalisé)"
              value={fmtPct(stats.roiRealized)}
              sub="sur les pièces vendues"
              positive={stats.roiRealized > 0}
              negative={stats.roiRealized < 0}
            />
          </section>

          {/* Charts */}
          <section className="grid md:grid-cols-3 gap-3 mb-8">
            <div className="card p-5 md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-display font-semibold">Profit cumulé</div>
                  <div className="text-xs text-muted">Toutes ventes confondues, net de frais.</div>
                </div>
              </div>
              <PortfolioChart data={timeline} />
            </div>
            <div className="card p-5">
              <div className="font-display font-semibold mb-1">Répartition</div>
              <div className="text-xs text-muted mb-4">Par catégorie</div>
              <CategoryDonut data={stats.countByCategory} />
            </div>
          </section>

          {/* AI Lab */}
          <section className="mb-8">
            <AILab items={items} />
          </section>

          {/* Inventory */}
          <section className="mb-8">
            <InventoryTable items={items} onAdd={openAdd} onEdit={openEdit} />
          </section>

          {/* Flex card */}
          <section>
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <div className="font-display font-semibold">Ta flex card</div>
                <div className="text-xs text-muted">Screenshot et balance sur ta story.</div>
              </div>
            </div>
            <FlexCard stats={stats} />
          </section>
        </>
      )}

      {modalOpen && (
        <ItemModal
          item={editing}
          onClose={() => setModalOpen(false)}
          onSave={save}
          onDelete={remove}
        />
      )}
    </main>
  );
}

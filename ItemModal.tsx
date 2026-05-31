"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Item, Category, Status } from "@/lib/types";

interface Props {
  item: Item | null;
  onClose: () => void;
  onSave: (item: Item) => void;
  onDelete?: (id: string) => void;
}

const blank: Item = {
  id: "",
  name: "",
  brand: "",
  category: "sneakers",
  size: "",
  buyPrice: 0,
  buyDate: new Date().toISOString().slice(0, 10),
  marketPrice: 0,
  status: "stock",
};

export default function ItemModal({ item, onClose, onSave, onDelete }: Props) {
  const [draft, setDraft] = useState<Item>(blank);

  useEffect(() => {
    if (item) setDraft({ ...item });
    else setDraft({ ...blank, id: crypto.randomUUID() });
  }, [item]);

  function update<K extends keyof Item>(k: K, v: Item[K]) {
    setDraft((d) => ({ ...d, [k]: v }));
  }

  function handleSave() {
    if (!draft.name.trim()) return;
    onSave(draft);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="card max-w-2xl w-full p-6 fade-up max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div className="font-display font-semibold text-lg">{item ? "Modifier la pièce" : "Nouvelle pièce"}</div>
          <button onClick={onClose} className="text-muted hover:text-text"><X className="h-5 w-5" /></button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="text-xs text-muted">Nom</label>
            <input className="input mt-1" value={draft.name} onChange={(e) => update("name", e.target.value)} placeholder="Air Jordan 4 Bred" />
          </div>
          <div>
            <label className="text-xs text-muted">Marque</label>
            <input className="input mt-1" value={draft.brand} onChange={(e) => update("brand", e.target.value)} placeholder="Jordan" />
          </div>
          <div>
            <label className="text-xs text-muted">Catégorie</label>
            <select className="input mt-1" value={draft.category} onChange={(e) => update("category", e.target.value as Category)}>
              <option value="sneakers">Sneakers</option>
              <option value="streetwear">Streetwear</option>
              <option value="accessoire">Accessoire</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted">Taille</label>
            <input className="input mt-1" value={draft.size || ""} onChange={(e) => update("size", e.target.value)} placeholder="EU 43" />
          </div>
          <div>
            <label className="text-xs text-muted">Statut</label>
            <select className="input mt-1" value={draft.status} onChange={(e) => update("status", e.target.value as Status)}>
              <option value="stock">En stock</option>
              <option value="listed">En vente</option>
              <option value="sold">Vendu</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted">Prix d'achat (€)</label>
            <input type="number" className="input mt-1" value={draft.buyPrice} onChange={(e) => update("buyPrice", parseFloat(e.target.value) || 0)} />
          </div>
          <div>
            <label className="text-xs text-muted">Date d'achat</label>
            <input type="date" className="input mt-1" value={draft.buyDate} onChange={(e) => update("buyDate", e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className="text-xs text-muted">Valeur marché estimée (€) — pour les pièces non vendues</label>
            <input type="number" className="input mt-1" value={draft.marketPrice} onChange={(e) => update("marketPrice", parseFloat(e.target.value) || 0)} />
          </div>
          {draft.status === "sold" && (
            <>
              <div>
                <label className="text-xs text-muted">Prix de vente (€)</label>
                <input type="number" className="input mt-1" value={draft.sellPrice || 0} onChange={(e) => update("sellPrice", parseFloat(e.target.value) || 0)} />
              </div>
              <div>
                <label className="text-xs text-muted">Date de vente</label>
                <input type="date" className="input mt-1" value={draft.sellDate || ""} onChange={(e) => update("sellDate", e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-muted">Plateforme</label>
                <input className="input mt-1" value={draft.platform || ""} onChange={(e) => update("platform", e.target.value)} placeholder="Vinted, StockX…" />
              </div>
              <div>
                <label className="text-xs text-muted">Frais plateforme (%)</label>
                <input type="number" className="input mt-1" value={draft.feesPercent || 0} onChange={(e) => update("feesPercent", parseFloat(e.target.value) || 0)} />
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-between mt-6 gap-3">
          <div>
            {item && onDelete && (
              <button
                className="btn btn-danger"
                onClick={() => {
                  onDelete(item.id);
                  onClose();
                }}
              >
                Supprimer
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button className="btn btn-ghost" onClick={onClose}>Annuler</button>
            <button className="btn btn-primary" onClick={handleSave}>Enregistrer</button>
          </div>
        </div>
      </div>
    </div>
  );
}

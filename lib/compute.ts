import type { Item, Status } from "./types";

export function netSellRevenue(item: Item): number {
  if (item.status !== "sold" || item.sellPrice == null) return 0;
  const fees = (item.feesPercent ?? 0) / 100;
  return item.sellPrice * (1 - fees);
}

export interface PortfolioStats {
  portfolioValue: number;
  totalInvestedHeld: number;
  totalInvestedSold: number;
  realizedProfit: number;
  unrealizedPL: number;
  roiRealized: number;
  count: number;
  countByStatus: Record<Status, number>;
  countByCategory: Record<string, number>;
  bestFlip?: { name: string; profit: number };
}

export function computeStats(items: Item[]): PortfolioStats {
  let portfolioValue = 0,
    totalInvestedHeld = 0,
    totalInvestedSold = 0,
    realizedProfit = 0,
    unrealizedPL = 0;
  const countByStatus: Record<Status, number> = { stock: 0, listed: 0, sold: 0 };
  const countByCategory: Record<string, number> = {};
  let bestFlip: { name: string; profit: number } | undefined;

  for (const it of items) {
    countByStatus[it.status]++;
    countByCategory[it.category] = (countByCategory[it.category] || 0) + 1;
    if (it.status === "sold") {
      totalInvestedSold += it.buyPrice;
      const p = netSellRevenue(it) - it.buyPrice;
      realizedProfit += p;
      if (!bestFlip || p > bestFlip.profit) bestFlip = { name: it.name, profit: p };
    } else {
      portfolioValue += it.marketPrice;
      totalInvestedHeld += it.buyPrice;
      unrealizedPL += it.marketPrice - it.buyPrice;
    }
  }

  const roiRealized =
    totalInvestedSold > 0 ? (realizedProfit / totalInvestedSold) * 100 : 0;

  return {
    portfolioValue,
    totalInvestedHeld,
    totalInvestedSold,
    realizedProfit,
    unrealizedPL,
    roiRealized,
    count: items.length,
    countByStatus,
    countByCategory,
    bestFlip,
  };
}

export function profitTimeline(items: Item[]): { date: string; profit: number }[] {
  const sold = items
    .filter((i) => i.status === "sold" && i.sellDate)
    .sort((a, b) => (a.sellDate! < b.sellDate! ? -1 : 1));
  let cum = 0;
  return sold.map((i) => {
    cum += netSellRevenue(i) - i.buyPrice;
    return { date: i.sellDate!, profit: Math.round(cum) };
  });
}

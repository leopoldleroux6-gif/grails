"use client";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { fmtEUR, fmtDate } from "@/lib/format";

interface Point { date: string; profit: number; }

export default function PortfolioChart({ data }: { data: Point[] }) {
  if (data.length === 0) {
    return (
      <div className="h-[260px] flex flex-col items-center justify-center text-center px-6">
        <div className="text-sm text-muted">Aucune vente enregistrée encore.</div>
        <div className="text-xs text-muted/60 mt-1">Le graphique se trace dès que tu vends une pièce.</div>
      </div>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C8FF3A" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#C8FF3A" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#1c1c20" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={(d) => fmtDate(d)}
          tick={{ fontSize: 11, fill: "#7A7A82" }}
          axisLine={{ stroke: "#222226" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#7A7A82" }}
          tickFormatter={(v) => `${v} €`}
          axisLine={{ stroke: "#222226" }}
          tickLine={false}
          width={56}
        />
        <Tooltip
          contentStyle={{
            background: "#111113",
            border: "1px solid #222226",
            borderRadius: 10,
            fontSize: 12,
          }}
          labelStyle={{ color: "#7A7A82", marginBottom: 4 }}
          labelFormatter={(d) => fmtDate(String(d))}
          formatter={(v: number) => [fmtEUR(v), "Profit cumulé"]}
        />
        <Area type="monotone" dataKey="profit" stroke="#C8FF3A" strokeWidth={2.2} fill="url(#grad)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

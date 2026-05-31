"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { categoryLabel } from "@/lib/format";

const COLORS: Record<string, string> = {
  sneakers: "#C8FF3A",
  streetwear: "#A855F7",
  accessoire: "#60A5FA",
};

export default function CategoryDonut({ data }: { data: Record<string, number> }) {
  const entries = Object.entries(data).filter(([, v]) => v > 0);
  if (entries.length === 0) {
    return <div className="h-[200px] flex items-center justify-center text-sm text-muted">Aucune donnée</div>;
  }
  const chartData = entries.map(([k, v]) => ({ name: categoryLabel(k), key: k, value: v }));

  return (
    <div className="flex items-center gap-6">
      <ResponsiveContainer width={170} height={170}>
        <PieChart>
          <Pie
            data={chartData}
            innerRadius={48}
            outerRadius={78}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {chartData.map((entry) => (
              <Cell key={entry.key} fill={COLORS[entry.key] || "#7A7A82"} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "#111113",
              border: "1px solid #222226",
              borderRadius: 10,
              fontSize: 12,
            }}
            formatter={(v: number, name: string) => [`${v} pièces`, name]}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-2.5 text-sm flex-1">
        {chartData.map((e) => (
          <div key={e.key} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: COLORS[e.key] }} />
              <span className="text-text">{e.name}</span>
            </div>
            <span className="text-muted numeric">{e.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

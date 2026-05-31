"use client";
import clsx from "clsx";

interface Props {
  label: string;
  value: string;
  sub?: string;
  positive?: boolean;
  negative?: boolean;
  accent?: boolean;
}

export default function KPICard({ label, value, sub, positive, negative, accent }: Props) {
  return (
    <div className="card p-5 fade-up">
      <div className="text-[11px] uppercase tracking-wider text-muted mb-2 font-medium">{label}</div>
      <div
        className={clsx(
          "font-display font-bold text-3xl numeric leading-none",
          accent ? "text-lime" : "text-text"
        )}
      >
        {value}
      </div>
      {sub && (
        <div
          className={clsx(
            "mt-2 text-xs font-medium numeric",
            positive && "text-lime",
            negative && "text-red-400",
            !positive && !negative && "text-muted"
          )}
        >
          {sub}
        </div>
      )}
    </div>
  );
}

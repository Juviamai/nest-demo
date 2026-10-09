import type { ReactNode } from "react";

export function Card({
  className,
  children,
  id,
}: {
  className?: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={`rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.05)] ${
        className ?? ""
      }`}
    >
      {children}
    </div>
  );
}

export function Dot({ tone }: { tone: "emerald" | "amber" | "teal" | "slate" }) {
  const colors: Record<string, string> = {
    emerald: "bg-emerald-500",
    amber: "bg-amber-400",
    teal: "bg-teal-500",
    slate: "bg-slate-300",
  };
  return (
    <span className={`inline-block h-2 w-2 shrink-0 rounded-full ${colors[tone]}`} />
  );
}

export function ConfidenceBar({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-teal-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-medium tabular-nums text-slate-500">
        {pct}%
      </span>
    </div>
  );
}

export function TypePill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
      {label}
    </span>
  );
}

export function StatBlock({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-slate-800">{children}</div>
    </div>
  );
}

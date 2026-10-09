import {
  Activity,
  Bird,
  Boxes,
  Brain,
  Home,
  Radio,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { useApp, type Page } from "../state/AppState";
import { Dot } from "./ui";

const NAV: { id: Page; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "memory", label: "Memory", icon: Brain },
  { id: "objects", label: "Objects", icon: Boxes },
  { id: "events", label: "Events", icon: Activity },
  { id: "sensors", label: "Sensors", icon: Radio },
  { id: "privacy", label: "Privacy", icon: ShieldCheck },
  { id: "settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const { page, setPage, todayMemoryCount } = useApp();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      {/* Wordmark */}
      <div className="flex items-center gap-3 px-5 pb-5 pt-6">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-teal-600 text-white">
          <Bird size={19} strokeWidth={2.2} />
        </div>
        <div className="leading-tight">
          <div className="text-[17px] font-bold tracking-tight text-slate-900">
            NEST
          </div>
          <div className="text-[11px] font-medium text-slate-400">
            AI Memory Layer
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3">
        {NAV.map((item) => {
          const active = page === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-teal-50 text-teal-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon size={17} strokeWidth={active ? 2.4 : 2} />
              {item.label}
              {item.id === "memory" && todayMemoryCount > 0 && (
                <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-slate-500">
                  {todayMemoryCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* System status */}
      <div className="p-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-slate-900 text-white">
              <Brain size={14} />
            </div>
            <div className="leading-tight">
              <div className="text-[13px] font-semibold text-slate-800">
                NEST AI
              </div>
              <div className="text-[11px] text-slate-400">
                Home Memory System
              </div>
            </div>
          </div>
          <div className="mt-3 space-y-1.5 text-[12px] text-slate-500">
            <div className="flex items-center gap-2">
              <Dot tone="emerald" />
              System online
            </div>
            <div className="flex items-center gap-2">
              <Dot tone="amber" />
              Demo mode · simulated sensing
            </div>
          </div>
        </div>
        <div className="mt-3 px-1 text-[11px] text-slate-300">
          Prototype v0.1
        </div>
      </div>
    </aside>
  );
}

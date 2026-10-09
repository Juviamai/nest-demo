import { ArrowRight, Brain, Camera, Database, ScanLine, Sparkles } from "lucide-react";
import { Card } from "./ui";

const STEPS = [
  { icon: Camera, title: "Camera + Sensors", sub: "Sense" },
  { icon: ScanLine, title: "Capture", sub: "Event frames" },
  { icon: Brain, title: "Analyze", sub: "AI understanding" },
  { icon: Database, title: "Remember", sub: "Spatial memory" },
  { icon: Sparkles, title: "Answer", sub: "Ask NEST" },
];

const TRACE = [
  { label: "Camera detects", detail: "“Glasses moved”" },
  { label: "AI interprets", detail: "Glasses were moved to the bedroom desk" },
  {
    label: "NEST stores",
    detail: "Object: Glasses · Location: Bedroom desk · Time: 8:42 PM",
  },
  { label: "User asks", detail: "“Where are my glasses?”" },
  { label: "NEST answers", detail: "“Last seen on the bedroom desk at 8:42 PM.”" },
];

export function PipelineCard({ compact = false }: { compact?: boolean }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-bold text-slate-900">
            Memory pipeline
          </h2>
          <p className="text-[12px] text-slate-400">
            How a sighting becomes an answer
          </p>
        </div>
      </div>

      {/* Steps */}
      <div className="mt-4 flex items-center justify-between gap-1 overflow-x-auto pb-1">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="flex min-w-0 items-center gap-1">
              <div className="flex min-w-[64px] flex-col items-center text-center">
                <div className="grid h-10 w-10 place-items-center rounded-full border border-teal-100 bg-teal-50 text-teal-600">
                  <Icon size={17} />
                </div>
                <div className="mt-1.5 text-[11px] font-semibold leading-tight text-slate-700">
                  {step.title}
                </div>
                <div className="text-[10px] text-slate-400">{step.sub}</div>
              </div>
              {i < STEPS.length - 1 && (
                <ArrowRight size={14} className="mb-7 shrink-0 text-slate-300" />
              )}
            </div>
          );
        })}
      </div>

      {!compact && (
        <div className="mt-5 rounded-lg border border-slate-100 bg-slate-50 p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Example trace — the glasses query
          </div>
          <ol className="mt-2.5 space-y-2.5">
            {TRACE.map((t, i) => (
              <li key={t.label} className="flex items-baseline gap-3">
                <span className="grid h-5 w-5 shrink-0 translate-y-[2px] place-items-center rounded-full bg-white text-[10.5px] font-bold text-teal-600 ring-1 ring-slate-200">
                  {i + 1}
                </span>
                <span className="text-[12.5px] leading-snug">
                  <span className="font-semibold text-slate-700">
                    {t.label}:
                  </span>{" "}
                  <span className="text-slate-500">{t.detail}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </Card>
  );
}

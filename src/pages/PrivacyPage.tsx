import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  Database,
  Lock,
  RotateCcw,
  Trash2,
  Video,
} from "lucide-react";
import { useApp } from "../state/AppState";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { isToday } from "../utils/format";
import { Card } from "../components/ui";

const PRINCIPLES = [
  {
    icon: Database,
    title: "Event-based memory",
    body: "NEST stores meaningful events rather than continuous video. Remember the event — not the footage.",
  },
  {
    icon: Lock,
    title: "User control",
    body: "You decide what NEST remembers. Memories can be reviewed and deleted at any time.",
  },
  {
    icon: Brain,
    title: "Local-first processing",
    body: "Where technically possible, processing can happen on-device. This prototype simulates the sensing layer.",
  },
];

const FLOW = [
  { icon: Video, label: "Video / camera input" },
  { icon: Brain, label: "AI event understanding" },
  { icon: Database, label: "Compact memory" },
  { icon: Trash2, label: "Optional deletion" },
];

export function PrivacyPage() {
  const { events, deleteTodayMemories, restoreDemoData, todayMemoryCount } =
    useApp();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const deleted = todayMemoryCount === 0;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Privacy
        </h2>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mt-1 max-w-2xl text-[22px] font-bold leading-snug tracking-tight text-slate-900"
        >
          Remember the event — not the footage.
        </motion.p>
        <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-slate-500">
          NEST is designed around compact event memories instead of continuous
          recording. Here is how the data flow is intended to work in this
          prototype.
        </p>
      </div>

      {/* Principles */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {PRINCIPLES.map((p) => {
          const Icon = p.icon;
          return (
            <Card key={p.title} className="p-5">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-teal-50 text-teal-600">
                <Icon size={18} />
              </div>
              <h3 className="mt-3 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                {p.title}
              </h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-slate-600">
                {p.body}
              </p>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        {/* Flow visual */}
        <Card className="p-5">
          <h3 className="text-[15px] font-bold text-slate-900">
            From camera input to memory
          </h3>
          <div className="mt-4 space-y-0">
            {FLOW.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={f.label}>
                  <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-teal-600 ring-1 ring-slate-200">
                      <Icon size={16} />
                    </span>
                    <span className="text-[13.5px] font-semibold text-slate-700">
                      {f.label}
                    </span>
                    {f.label === "Optional deletion" && (
                      <span className="ml-auto text-[11px] font-medium text-slate-400">
                        You stay in control
                      </span>
                    )}
                  </div>
                  {i < FLOW.length - 1 && (
                    <div className="flex justify-center py-1">
                      <ArrowRight size={15} className="rotate-90 text-slate-300" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Memory controls */}
        <Card className="p-5">
          <h3 className="text-[15px] font-bold text-slate-900">
            Memory controls
          </h3>
          <p className="mt-1 text-[13px] text-slate-500">
            Review what has been remembered and delete it when you want.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
              <div className="text-2xl font-bold tabular-nums text-slate-900">
                {todayMemoryCount}
              </div>
              <div className="mt-0.5 text-[12px] font-medium text-slate-400">
                Memories stored today
              </div>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
              <div className="text-2xl font-bold tabular-nums text-slate-900">
                {events.filter((e) => !isToday(e.timestamp)).length}
              </div>
              <div className="mt-0.5 text-[12px] font-medium text-slate-400">
                Older memories retained
              </div>
            </div>
          </div>

          {deleted ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 rounded-lg border border-teal-100 bg-teal-50 p-4"
            >
              <div className="flex items-center gap-2 text-[14px] font-semibold text-teal-800">
                <CheckCircle2 size={16} />
                Today's memories have been deleted.
              </div>
              <p className="mt-1 text-[12.5px] leading-relaxed text-teal-700/80">
                This was a demo interaction. Restore the simulated data to
                continue presenting.
              </p>
              <button
                onClick={restoreDemoData}
                className="mt-3 inline-flex items-center gap-2 rounded-lg border border-teal-200 bg-white px-3.5 py-2 text-[12.5px] font-semibold text-teal-700 transition-colors hover:bg-teal-50"
              >
                <RotateCcw size={13} />
                Restore demo data
              </button>
            </motion.div>
          ) : (
            <>
              <button
                onClick={() => setConfirmOpen(true)}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-rose-700"
              >
                <Trash2 size={14} />
                Delete Today's Memories
              </button>
              <p className="mt-2.5 text-[11.5px] text-slate-400">
                Demo interaction — removes today's simulated memories from the
                timeline.
              </p>
            </>
          )}
        </Card>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete today's memories?"
        body={`This will remove ${todayMemoryCount} memories from today's timeline, including last-seen locations. This is a demo action — you can restore the simulated data afterwards.`}
        confirmLabel="Delete memories"
        destructive
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          deleteTodayMemories();
        }}
      />
    </div>
  );
}

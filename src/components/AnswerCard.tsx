import { motion } from "framer-motion";
import {
  AlertCircle,
  History,
  MapPin,
  Sparkles,
} from "lucide-react";
import { useApp } from "../state/AppState";
import { roomName } from "../data/events";
import {
  confidencePercent,
  dayLabel,
  formatTime,
} from "../utils/format";
import { objectIcon } from "../utils/objectIcons";
import { Card, ConfidenceBar, TypePill } from "./ui";
import type { MemoryEvent } from "../types";

const riseIn = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: "easeOut" as const },
};

export function AnswerCard() {
  const { outcome, openEventPanel, showOnFloorPlan } = useApp();
  if (!outcome) return null;

  if (outcome.kind === "object") {
    return (
      <motion.div {...riseIn}>
        <Card className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-600">
                <Sparkles size={13} />
                NEST answer
              </div>
              <h3 className="mt-2 text-[19px] font-bold leading-snug text-slate-900">
                {outcome.lines[0]}
              </h3>
              <p className="mt-1 text-[15px] text-slate-600">
                {outcome.lines[1]}
              </p>
            </div>
            {(() => {
              const Icon = objectIcon(outcome.event.objectName);
              return (
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-600">
                  <Icon size={22} />
                </div>
              );
            })()}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 rounded-lg bg-slate-50 p-4 sm:grid-cols-4">
            <div className="min-w-0">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Last seen
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-teal-700">
                <MapPin size={13} className="shrink-0" />
                <span className="truncate">{outcome.event.location}</span>
              </div>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                When
              </div>
              <div className="mt-1 text-sm font-semibold text-slate-800">
                {dayLabel(outcome.event.timestamp)} ·{" "}
                {formatTime(outcome.event.timestamp)}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Confidence
              </div>
              <div className="mt-1.5">
                <ConfidenceBar value={outcome.event.confidence} />
              </div>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Event
              </div>
              <div className="mt-1 text-sm font-semibold text-slate-800">
                Object {outcome.event.eventType.toLowerCase()}
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={showOnFloorPlan}
              className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-teal-700"
            >
              <MapPin size={14} />
              Show on floor plan
            </button>
            <button
              onClick={() => openEventPanel(outcome.event.id)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 transition-colors hover:border-teal-300 hover:text-teal-700"
            >
              <History size={14} />
              View memory
            </button>
            <span className="ml-auto hidden text-[11px] text-slate-400 md:block">
              Based on the latest detected event · Simulated AI detection
            </span>
          </div>
        </Card>
      </motion.div>
    );
  }

  if (outcome.kind === "activity") {
    return (
      <motion.div {...riseIn}>
        <Card className="p-6">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-600">
            Today's object activity
          </div>
          <h3 className="mt-2 text-[19px] font-bold text-slate-900">
            {outcome.lines[0]}
          </h3>
          <p className="mt-1 text-[14px] text-slate-500">
            {outcome.lines[1] ||
              "No object events were detected today."}
          </p>

          {outcome.items.length > 0 && (
            <div className="mt-4 divide-y divide-slate-100">
              {outcome.items.map((e) => (
                <ActivityRow key={e.id} event={e} />
              ))}
            </div>
          )}
        </Card>
      </motion.div>
    );
  }

  if (outcome.kind === "recent") {
    return (
      <motion.div {...riseIn}>
        <Card className="p-6">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-600">
            Recent memories
          </div>
          <h3 className="mt-2 text-[19px] font-bold text-slate-900">
            {outcome.lines[0]}
          </h3>
          {outcome.lines[1] && (
            <p className="mt-1 text-[14px] text-slate-500">{outcome.lines[1]}</p>
          )}
          {outcome.events.length > 0 && (
            <div className="mt-4 divide-y divide-slate-100">
              {outcome.events.map((e) => (
                <ActivityRow key={e.id} event={e} />
              ))}
            </div>
          )}
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div {...riseIn}>
      <Card className="flex flex-col items-center px-6 py-10 text-center">
        <div className="grid h-11 w-11 place-items-center rounded-full bg-slate-100 text-slate-400">
          <AlertCircle size={20} />
        </div>
        <h3 className="mt-3 text-[17px] font-semibold text-slate-800">
          {outcome.lines[0]}
        </h3>
        {outcome.lines[1] && (
          <p className="mt-1 max-w-md text-[14px] text-slate-500">
            {outcome.lines[1]}
          </p>
        )}
      </Card>
    </motion.div>
  );
}

function ActivityRow({ event }: { event: MemoryEvent }) {
  const { selectObject, openEventPanel } = useApp();
  const Icon = objectIcon(event.objectName);

  return (
    <button
      onClick={() =>
        event.objectName ? selectObject(event.objectName) : openEventPanel(event.id)
      }
      className="flex w-full items-center gap-3 py-2.5 text-left transition-colors first:pt-1 hover:bg-slate-50/80"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-50 text-teal-600">
        <Icon size={16} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-[14px] font-semibold text-slate-800">
            {event.objectName ?? roomName(event.room)}
          </span>
          <TypePill label={event.eventType} />
        </span>
        <span className="mt-0.5 block truncate text-[12.5px] text-slate-500">
          {event.location}
        </span>
      </span>
      <span className="shrink-0 text-right">
        <span className="block text-[13px] font-medium tabular-nums text-slate-600">
          {formatTime(event.timestamp)}
        </span>
        <span className="block text-[11px] tabular-nums text-slate-400">
          {confidencePercent(event.confidence)}
        </span>
      </span>
    </button>
  );
}

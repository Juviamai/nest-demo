import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useApp } from "../state/AppState";
import { roomName } from "../data/events";
import { dayLabel, formatTime } from "../utils/format";
import { eventTypeIcon, objectIcon } from "../utils/objectIcons";
import { Card, ConfidenceBar, TypePill } from "./ui";
import type { MemoryEvent } from "../types";

interface MemoryTimelineProps {
  title: string;
  events: MemoryEvent[];
  limit?: number;
  linkLabel?: string;
  onLink?: () => void;
}

export function MemoryTimeline({
  title,
  events,
  limit,
  linkLabel,
  onLink,
}: MemoryTimelineProps) {
  const { openEventPanel } = useApp();
  const list = limit ? events.slice(0, limit) : events;

  // Precompute day separators ("Today" / "Yesterday" / dates)
  const rows: { event: MemoryEvent; day: string | null }[] = [];
  let lastDay = "";
  for (const e of list) {
    const day = dayLabel(e.timestamp);
    const showDay = day !== lastDay;
    if (showDay) lastDay = day;
    rows.push({ event: e, day: showDay ? day : null });
  }

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-[15px] font-bold text-slate-900">{title}</h2>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-slate-500">
            {list.length}
          </span>
        </div>
        {linkLabel && onLink && (
          <button
            onClick={onLink}
            className="text-[12.5px] font-semibold text-teal-600 hover:text-teal-700"
          >
            {linkLabel} →
          </button>
        )}
      </div>

      {rows.length === 0 ? (
        <div className="mt-4 rounded-lg border border-dashed border-slate-200 px-4 py-8 text-center text-[13px] text-slate-400">
          No memories recorded. NEST will remember events as they happen
          (simulated).
        </div>
      ) : (
        <div className="mt-3">
          {rows.map(({ event, day }, i) => {
            const Icon = event.objectName
              ? objectIcon(event.objectName)
              : eventTypeIcon(event.eventType);
            return (
              <div key={event.id}>
                {day && (
                  <div className="mb-1 mt-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 first:mt-0">
                    {day}
                  </div>
                )}
                <motion.button
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: Math.min(i * 0.04, 0.4) }}
                  onClick={() => openEventPanel(event.id)}
                  className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-slate-50"
                >
                  <span className="w-[62px] shrink-0 text-[12.5px] font-medium tabular-nums text-slate-400">
                    {formatTime(event.timestamp)}
                  </span>
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${
                      event.objectName
                        ? "bg-teal-50 text-teal-600"
                        : "bg-slate-50 text-slate-400"
                    }`}
                  >
                    <Icon size={16} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-[14px] font-semibold text-slate-800">
                        {event.objectName ?? roomName(event.room)}
                      </span>
                      <TypePill label={event.eventType} />
                    </span>
                    <span className="mt-0.5 flex items-center gap-1 truncate text-[12.5px] text-slate-500">
                      <MapPin size={11} className="shrink-0 text-slate-400" />
                      {event.location}
                    </span>
                  </span>
                  <span className="shrink-0">
                    <ConfidenceBar value={event.confidence} />
                  </span>
                </motion.button>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

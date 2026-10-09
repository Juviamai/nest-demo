import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useApp } from "../state/AppState";
import { ROOMS, roomName } from "../data/events";
import { getRecentMemories } from "../services/memory";
import { dayLabel, formatTime } from "../utils/format";
import { eventTypeIcon, objectIcon } from "../utils/objectIcons";
import { Card, ConfidenceBar, TypePill } from "../components/ui";
import type { RoomId } from "../types";

type KindFilter = "all" | "objects" | "ambient";

export function EventsPage() {
  const { events, openEventPanel } = useApp();
  const [kind, setKind] = useState<KindFilter>("all");
  const [room, setRoom] = useState<RoomId | "all">("all");

  const all = getRecentMemories(events, 200);
  const filtered = all.filter((e) => {
    if (kind === "objects" && e.objectName === null) return false;
    if (kind === "ambient" && e.objectName !== null) return false;
    if (room !== "all" && e.room !== room) return false;
    return true;
  });

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Events
        </h2>
        <p className="mt-0.5 text-[13.5px] text-slate-500">
          The raw memory stream — every compact event NEST has stored.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {(
          [
            ["all", "All events"],
            ["objects", "Objects only"],
            ["ambient", "Ambient only"],
          ] as [KindFilter, string][]
        ).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setKind(value)}
            className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-medium transition-colors ${
              kind === value
                ? "bg-slate-900 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            }`}
          >
            {label}
          </button>
        ))}
        <span className="mx-1 h-5 w-px bg-slate-200" />
        <button
          onClick={() => setRoom("all")}
          className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${
            room === "all"
              ? "bg-teal-50 text-teal-700"
              : "border border-slate-200 bg-white text-slate-500 hover:border-slate-300"
          }`}
        >
          All rooms
        </button>
        {ROOMS.map((r) => (
          <button
            key={r.id}
            onClick={() => setRoom(r.id)}
            className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${
              room === r.id
                ? "bg-teal-50 text-teal-700"
                : "border border-slate-200 bg-white text-slate-500 hover:border-slate-300"
            }`}
          >
            {r.name}
          </button>
        ))}
      </div>

      {/* Event rows */}
      {filtered.length === 0 ? (
        <Card className="px-6 py-12 text-center">
          <p className="text-[14px] font-medium text-slate-600">
            No events match this filter.
          </p>
          <p className="mt-1 text-[13px] text-slate-400">
            Memories may have been deleted from the Privacy page.
          </p>
        </Card>
      ) : (
        <Card className="divide-y divide-slate-100">
          {filtered.map((e, i) => {
            const Icon = e.objectName
              ? objectIcon(e.objectName)
              : eventTypeIcon(e.eventType);
            return (
              <motion.button
                key={e.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: Math.min(i * 0.02, 0.3) }}
                onClick={() => openEventPanel(e.id)}
                className="flex w-full items-center gap-4 px-5 py-3 text-left transition-colors hover:bg-slate-50"
              >
                <span className="w-[64px] shrink-0 text-[12.5px] font-medium tabular-nums text-slate-400">
                  {formatTime(e.timestamp)}
                </span>
                <span className="hidden w-[70px] shrink-0 text-[11px] font-medium text-slate-400 sm:block">
                  {dayLabel(e.timestamp)}
                </span>
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${
                    e.objectName
                      ? "bg-teal-50 text-teal-600"
                      : "bg-slate-50 text-slate-400"
                  }`}
                >
                  <Icon size={16} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-[14px] font-semibold text-slate-800">
                      {e.objectName ?? roomName(e.room)}
                    </span>
                    <TypePill label={e.eventType} />
                  </span>
                  <span className="mt-0.5 flex items-center gap-1 truncate text-[12.5px] text-slate-500">
                    <MapPin size={11} className="shrink-0 text-slate-400" />
                    {e.location}
                    <span className="text-slate-300">·</span>
                    <span className="truncate text-slate-400">{e.source}</span>
                  </span>
                </span>
                <span className="hidden shrink-0 md:block">
                  <ConfidenceBar value={e.confidence} />
                </span>
              </motion.button>
            );
          })}
        </Card>
      )}
    </div>
  );
}

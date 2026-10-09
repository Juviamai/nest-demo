import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, History, MapPin, X } from "lucide-react";
import { useApp } from "../state/AppState";
import { getObjectHistory } from "../services/memory";
import { roomName } from "../data/events";
import { formatDayDate, formatFull, formatTime } from "../utils/format";
import { eventTypeIcon, objectIcon } from "../utils/objectIcons";
import { ConfidenceBar, TypePill } from "./ui";

export function EventDetailPanel() {
  const {
    events,
    panelEventId,
    closeEventPanel,
    applyMarkerForEvent,
    showOnFloorPlan,
    openEventPanel,
  } = useApp();
  const [showHistory, setShowHistory] = useState(false);

  const event = events.find((e) => e.id === panelEventId) ?? null;
  const history =
    event?.objectName != null
      ? getObjectHistory(events, event.objectName)
      : [];

  return (
    <AnimatePresence>
      {event && (
        <>
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeEventPanel}
            className="fixed inset-0 z-40 bg-slate-900/10"
          />
          <motion.aside
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="fixed right-0 top-0 z-50 flex h-full w-[430px] max-w-[92vw] flex-col border-l border-slate-200 bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 px-6 pb-4 pt-5">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-teal-50 text-teal-600">
                  {(() => {
                    const Icon = event.objectName
                      ? objectIcon(event.objectName)
                      : eventTypeIcon(event.eventType);
                    return <Icon size={20} />;
                  })()}
                </div>
                <div>
                  <div className="text-[16px] font-bold text-slate-900">
                    {event.objectName ?? roomName(event.room)}
                  </div>
                  <div className="mt-0.5">
                    <TypePill label={event.eventType} />
                  </div>
                </div>
              </div>
              <button
                onClick={closeEventPanel}
                aria-label="Close panel"
                className="grid h-8 w-8 place-items-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <p className="text-[14px] leading-relaxed text-slate-600">
                {event.description}
              </p>

              <dl className="mt-5 grid grid-cols-[118px_minmax(0,1fr)] gap-x-3 gap-y-4 text-[13px]">
                <dt className="font-semibold uppercase tracking-wider text-slate-400 [font-size:11px]">
                  Event
                </dt>
                <dd className="font-medium text-slate-800">
                  Object {event.eventType.toLowerCase()}
                </dd>

                <dt className="font-semibold uppercase tracking-wider text-slate-400 [font-size:11px]">
                  Time
                </dt>
                <dd className="font-medium text-slate-800">
                  {formatDayDate(event.timestamp)}
                  <span className="block tabular-nums text-slate-500">
                    {formatTime(event.timestamp)}
                  </span>
                </dd>

                <dt className="font-semibold uppercase tracking-wider text-slate-400 [font-size:11px]">
                  Location
                </dt>
                <dd className="flex items-center gap-1.5 font-medium text-slate-800">
                  <MapPin size={13} className="text-teal-600" />
                  {event.location}
                  <span className="font-normal text-slate-400">
                    · {roomName(event.room)}
                  </span>
                </dd>

                <dt className="font-semibold uppercase tracking-wider text-slate-400 [font-size:11px]">
                  Confidence
                </dt>
                <dd>
                  <ConfidenceBar value={event.confidence} />
                </dd>

                <dt className="font-semibold uppercase tracking-wider text-slate-400 [font-size:11px]">
                  Source
                </dt>
                <dd className="font-medium text-slate-800">{event.source}</dd>

                <dt className="font-semibold uppercase tracking-wider text-slate-400 [font-size:11px]">
                  Memory type
                </dt>
                <dd className="font-medium text-slate-800">
                  {event.memoryType === "Spatial"
                    ? "Spatial memory"
                    : "Ambient memory"}
                </dd>
              </dl>

              <div className="mt-6 rounded-lg border border-slate-100 bg-slate-50 p-3.5">
                <p className="text-[12.5px] leading-relaxed text-slate-500">
                  Visual context was analyzed and converted into a compact
                  event memory.
                </p>
                <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  Simulated AI event detection · Demo event
                </span>
              </div>

              {/* Event history */}
              {event.objectName != null && (
                <div className="mt-6">
                  <button
                    onClick={() => setShowHistory((s) => !s)}
                    className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-3.5 py-2.5 text-[13px] font-semibold text-slate-700 transition-colors hover:border-teal-300 hover:text-teal-700"
                  >
                    <span className="flex items-center gap-2">
                      <History size={14} />
                      {showHistory ? "Hide event history" : "Show event history"}
                    </span>
                    <ChevronDown
                      size={15}
                      className={`transition-transform ${showHistory ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {showHistory && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2 space-y-1 border-l-2 border-slate-100 pl-3">
                          {history.map((h) => {
                            const active = h.id === event.id;
                            return (
                              <button
                                key={h.id}
                                onClick={() => openEventPanel(h.id)}
                                className={`flex w-full items-baseline gap-3 rounded-md px-2 py-1.5 text-left text-[12.5px] transition-colors ${
                                  active
                                    ? "bg-teal-50 text-teal-800"
                                    : "hover:bg-slate-50"
                                }`}
                              >
                                <span className="w-[46px] shrink-0 tabular-nums text-slate-400">
                                  {formatTime(h.timestamp)}
                                </span>
                                <span className="min-w-0 flex-1 truncate text-slate-600">
                                  {h.description}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer actions */}
            <div className="border-t border-slate-100 px-6 py-4">
              <button
                onClick={() => {
                  applyMarkerForEvent(event);
                  showOnFloorPlan();
                }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-teal-700"
              >
                <MapPin size={14} />
                Show on floor plan
              </button>
              <p className="mt-2.5 text-center text-[11px] text-slate-400">
                Recorded {formatFull(event.timestamp)}
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

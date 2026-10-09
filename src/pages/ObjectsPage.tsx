import { History, MapPin } from "lucide-react";
import { useApp } from "../state/AppState";
import { TRACKED_OBJECTS, roomName } from "../data/events";
import { findLastSeenObject } from "../services/memory";
import { dayLabel, formatTime } from "../utils/format";
import { objectIcon } from "../utils/objectIcons";
import { FloorPlanCard } from "../components/FloorPlanCard";
import { Card, ConfidenceBar, TypePill } from "../components/ui";

export function ObjectsPage() {
  const { events, selectObject, openEventPanel, marker } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Objects
        </h2>
        <p className="mt-0.5 text-[13.5px] text-slate-500">
          Everything NEST is tracking. Select an object to see where it was
          last seen.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {TRACKED_OBJECTS.map((obj) => {
            const last = findLastSeenObject(events, obj.name);
            const Icon = objectIcon(obj.name);
            const selected = marker?.objectName === obj.name;
            return (
              <Card
                key={obj.name}
                className={`p-4 transition-all ${
                  selected
                    ? "ring-2 ring-teal-500 ring-offset-0"
                    : "hover:border-slate-300"
                }`}
              >
                <button
                  onClick={() => selectObject(obj.name)}
                  className="flex w-full items-start gap-3 text-left"
                >
                  <span
                    className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${
                      selected
                        ? "bg-teal-600 text-white"
                        : "bg-teal-50 text-teal-600"
                    }`}
                  >
                    <Icon size={20} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="text-[15px] font-bold text-slate-900">
                        {obj.name}
                      </span>
                      {last && <TypePill label={last.eventType} />}
                    </span>
                    {last ? (
                      <>
                        <span className="mt-1 block text-[13px] font-medium text-teal-700">
                          <MapPin size={11} className="mr-1 inline -translate-y-px" />
                          {last.location}
                        </span>
                        <span className="mt-0.5 block text-[12px] text-slate-400">
                          {dayLabel(last.timestamp)} ·{" "}
                          {formatTime(last.timestamp)} ·{" "}
                          {roomName(last.room)}
                        </span>
                      </>
                    ) : (
                      <span className="mt-1 block text-[13px] text-slate-400">
                        No memory recorded yet
                      </span>
                    )}
                  </span>
                  {last && (
                    <span className="shrink-0 pt-1">
                      <ConfidenceBar value={last.confidence} />
                    </span>
                  )}
                </button>
                {last && (
                  <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3">
                    <button
                      onClick={() => selectObject(obj.name)}
                      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[12px] font-semibold text-teal-600 transition-colors hover:bg-teal-50"
                    >
                      <MapPin size={12} />
                      Show on plan
                    </button>
                    <button
                      onClick={() => openEventPanel(last.id)}
                      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800"
                    >
                      <History size={12} />
                      View memory
                    </button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        <div className="xl:sticky xl:top-6">
          <FloorPlanCard />
        </div>
      </div>
    </div>
  );
}

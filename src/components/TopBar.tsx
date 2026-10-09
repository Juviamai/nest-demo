import { useState } from "react";
import { Bell } from "lucide-react";
import { useApp } from "../state/AppState";
import { getRecentMemories } from "../services/memory";
import { formatTime } from "../utils/format";
import { objectIcon } from "../utils/objectIcons";
import { todayLong } from "../utils/format";
import { Dot } from "./ui";

function greetingForHour(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function TopBar() {
  const { events, setPage } = useApp();
  const [open, setOpen] = useState(false);
  const [read, setRead] = useState(false);

  const notifications = getRecentMemories(
    events.filter((e) => e.objectName !== null),
    4
  );

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 xl:px-8">
      <div>
        <h1 className="text-[17px] font-bold tracking-tight text-slate-900">
          {greetingForHour(new Date().getHours())}, Mai
        </h1>
        <p className="text-[12.5px] text-slate-400">
          {todayLong()} · Your home remembers what matters.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-500 lg:flex">
          <Dot tone="emerald" />
          All systems online
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Notifications"
            className="relative grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:text-slate-800"
          >
            <Bell size={16} />
            {!read && notifications.length > 0 && (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-teal-500 ring-2 ring-white" />
            )}
          </button>

          {open && (
            <>
              <button
                aria-label="Close notifications"
                className="fixed inset-0 z-40 cursor-default"
                onClick={() => setOpen(false)}
              />
              <div className="absolute right-0 z-50 mt-2 w-[340px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <span className="text-sm font-semibold text-slate-800">
                    Notifications
                  </span>
                  <button
                    onClick={() => setRead(true)}
                    className="text-[12px] font-medium text-teal-600 hover:text-teal-700"
                  >
                    Mark all as read
                  </button>
                </div>
                {notifications.length === 0 ? (
                  <div className="px-4 py-6 text-center text-[13px] text-slate-400">
                    Nothing new. Your home is quiet.
                  </div>
                ) : (
                  notifications.map((n) => {
                    const Icon = objectIcon(n.objectName);
                    return (
                      <button
                        key={n.id}
                        onClick={() => {
                          setOpen(false);
                          setPage("events");
                        }}
                        className="flex w-full items-start gap-3 border-b border-slate-50 px-4 py-3 text-left last:border-0 hover:bg-slate-50"
                      >
                        <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-teal-50 text-teal-600">
                          <Icon size={15} />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-[13px] font-medium text-slate-800">
                            {n.objectName} {n.eventType.toLowerCase()} —{" "}
                            {n.location}
                          </span>
                          <span className="block text-[12px] text-slate-400">
                            {formatTime(n.timestamp)} · {n.source}
                          </span>
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>

        {/* Avatar */}
        <div className="grid h-9 w-9 place-items-center rounded-full bg-slate-900 text-[13px] font-bold text-white">
          M
        </div>
      </div>
    </header>
  );
}

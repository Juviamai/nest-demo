import { useState, type FormEvent, type KeyboardEvent } from "react";
import { Mic, Search } from "lucide-react";
import { useApp } from "../state/AppState";
import { TRACKED_OBJECTS } from "../data/events";
import { findLastSeenObject } from "../services/memory";
import { formatTime } from "../utils/format";
import { objectIcon } from "../utils/objectIcons";

const SUGGESTIONS = [
  "Where are my glasses?",
  "Where are my keys?",
  "What did I move today?",
  "Show recent memories",
];

export function SearchHero() {
  const { runQuery, startVoice, queryPhase, events } = useApp();
  const [value, setValue] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    runQuery(value);
  };

  // Explicit Enter handling so the hero interaction is guaranteed even if
  // the browser skips implicit form submission.
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      runQuery(value);
    }
  };

  return (
    <section>
      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
        Where is something?
      </div>

      <form
        onSubmit={submit}
        className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.05)] transition-all duration-200 focus-within:border-teal-400 focus-within:shadow-[0_0_0_4px_rgba(13,148,136,0.08)] hover:border-slate-300"
      >
        <Search size={18} className="shrink-0 text-slate-400" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Where are my glasses?"
          aria-label="Ask NEST anything"
          className="min-w-0 flex-1 bg-transparent text-[15px] text-slate-800 outline-none placeholder:text-slate-400"
        />
        <button
          type="button"
          onClick={startVoice}
          aria-label="Ask by voice"
          title="Ask by voice (simulated)"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-50 text-slate-500 transition-colors hover:bg-teal-50 hover:text-teal-600"
        >
          <Mic size={16} />
        </button>
        <div className="hidden shrink-0 items-center gap-2 border-l border-slate-100 pl-3 sm:flex">
          <kbd className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[11px] font-medium text-slate-400">
            Enter
          </kbd>
        </div>
      </form>

      {/* Suggestion chips */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => {
              setValue(s);
              runQuery(s);
            }}
            className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-[13px] font-medium text-slate-600 transition-colors hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Tracked objects strip */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-[12px] font-semibold uppercase tracking-wider text-slate-400">
          Tracked objects
        </span>
        {TRACKED_OBJECTS.map((obj) => {
          const last = findLastSeenObject(events, obj.name);
          const Icon = objectIcon(obj.name);
          return (
            <button
              key={obj.name}
              onClick={() => runQuery(`Where are my ${obj.name.toLowerCase()}?`)}
              className="group flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[13px] font-medium text-slate-700 transition-colors hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800"
            >
              <Icon size={15} className="text-teal-600" />
              {obj.name}
              {last && (
                <span className="text-[11px] font-normal tabular-nums text-slate-400 group-hover:text-teal-600">
                  {formatTime(last.timestamp)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Thinking indicator */}
      {queryPhase === "thinking" && (
        <div className="mt-4 flex items-center gap-2 text-[13px] font-medium text-teal-700">
          <span className="flex items-center gap-1">
            <span className="thinking-dot" />
            <span className="thinking-dot" />
            <span className="thinking-dot" />
          </span>
          NEST is thinking…
        </div>
      )}
    </section>
  );
}

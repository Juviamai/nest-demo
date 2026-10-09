import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { INITIAL_EVENTS } from "../data/events";
import {
  answerQuery,
  findLastSeenObject,
  objectAnswerLines,
} from "../services/memory";
import { formatTime, isToday } from "../utils/format";
import type {
  MarkerInfo,
  MemoryEvent,
  QueryOutcome,
} from "../types";

export type Page =
  | "home"
  | "memory"
  | "objects"
  | "events"
  | "sensors"
  | "privacy"
  | "settings";

export type QueryPhase = "idle" | "thinking" | "answered";
export type VoiceState = "idle" | "listening" | "heard" | "thinking";

interface AppStateValue {
  page: Page;
  setPage: (page: Page) => void;

  /** Live event database (affected by the privacy demo interactions) */
  events: MemoryEvent[];
  deleteTodayMemories: () => void;
  restoreDemoData: () => void;
  todayMemoryCount: number;

  queryPhase: QueryPhase;
  queryText: string;
  outcome: QueryOutcome | null;
  runQuery: (text: string, opts?: { instant?: boolean }) => void;
  selectObject: (objectName: string) => void;

  marker: MarkerInfo | null;
  markerPulse: number;
  clearMarker: () => void;
  applyMarkerForEvent: (event: MemoryEvent) => void;
  showOnFloorPlan: () => void;

  panelEventId: string | null;
  openEventPanel: (id: string) => void;
  closeEventPanel: () => void;

  voiceState: VoiceState;
  startVoice: () => void;
  cancelVoice: () => void;
}

const AppContext = createContext<AppStateValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<Page>("home");
  const [events, setEvents] = useState<MemoryEvent[]>(INITIAL_EVENTS);

  const [queryPhase, setQueryPhase] = useState<QueryPhase>("idle");
  const [queryText, setQueryText] = useState("");
  const [outcome, setOutcome] = useState<QueryOutcome | null>(null);

  const [marker, setMarker] = useState<MarkerInfo | null>(null);
  const [markerPulse, setMarkerPulse] = useState(0);

  const [panelEventId, setPanelEventId] = useState<string | null>(null);
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");

  const eventsRef = useRef(events);
  eventsRef.current = events;
  const timersRef = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const later = useCallback((fn: () => void, ms: number) => {
    timersRef.current.push(window.setTimeout(fn, ms));
  }, []);

  const applyMarkerForEvent = useCallback((event: MemoryEvent) => {
    setMarker({
      location: event.location,
      room: event.room,
      objectName: event.objectName,
      timeLabel: formatTime(event.timestamp),
      label: event.objectName ?? event.location,
    });
    setMarkerPulse((p) => p + 1);
  }, []);

  const runQuery = useCallback(
    (text: string, opts?: { instant?: boolean }) => {
      const trimmed = text.trim();
      clearTimers();
      if (!trimmed) {
        setQueryText("");
        setOutcome({
          kind: "unknown",
          lines: [
            "Ask NEST about an object — for example, “Where are my glasses?”",
          ],
        });
        setQueryPhase("answered");
        return;
      }
      setQueryText(trimmed);
      setQueryPhase("thinking");
      later(() => {
        const result = answerQuery(eventsRef.current, trimmed);
        setOutcome(result);
        setQueryPhase("answered");
        if (result.kind === "object") applyMarkerForEvent(result.event);
      }, opts?.instant ? 150 : 900);
    },
    [applyMarkerForEvent, clearTimers, later]
  );

  /** Direct selection (object chips / cards) — answers immediately. */
  const selectObject = useCallback(
    (objectName: string) => {
      clearTimers();
      const event = findLastSeenObject(eventsRef.current, objectName);
      setQueryText(`Where are my ${objectName.toLowerCase()}?`);
      if (!event) {
        setOutcome({
          kind: "unknown",
          lines: [
            `I don't have a memory for your ${objectName.toLowerCase()} yet.`,
            "Try asking about a tracked object — like your glasses, keys, or wallet.",
          ],
        });
        setQueryPhase("answered");
        return;
      }
      setOutcome({
        kind: "object",
        objectName,
        event,
        lines: objectAnswerLines(event),
      });
      setQueryPhase("answered");
      applyMarkerForEvent(event);
    },
    [applyMarkerForEvent, clearTimers]
  );

  const showOnFloorPlan = useCallback(() => {
    setPage("home");
    later(() => {
      document
        .getElementById("floorplan-card")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      setMarkerPulse((p) => p + 1);
    }, 90);
  }, [later]);

  const deleteTodayMemories = useCallback(() => {
    setEvents((prev) => prev.filter((e) => !isToday(e.timestamp)));
    setOutcome(null);
    setQueryPhase("idle");
    setQueryText("");
    setMarker(null);
    setPanelEventId(null);
  }, []);

  const restoreDemoData = useCallback(() => {
    setEvents(INITIAL_EVENTS);
  }, []);

  /** Simulated voice interaction: listen -> recognize -> think -> answer. */
  const startVoice = useCallback(() => {
    if (voiceState !== "idle") return;
    setVoiceState("listening");
    later(() => setVoiceState("heard"), 1400);
    later(() => setVoiceState("thinking"), 2200);
    later(() => {
      setVoiceState("idle");
      runQuery("Where are my glasses?", { instant: true });
    }, 3000);
  }, [voiceState, later, runQuery]);

  const cancelVoice = useCallback(() => {
    clearTimers();
    setVoiceState("idle");
  }, [clearTimers]);

  const openEventPanel = useCallback((id: string) => setPanelEventId(id), []);
  const closeEventPanel = useCallback(() => setPanelEventId(null), []);
  const clearMarker = useCallback(() => setMarker(null), []);

  const todayMemoryCount = useMemo(
    () => events.filter((e) => isToday(e.timestamp)).length,
    [events]
  );

  const value = useMemo<AppStateValue>(
    () => ({
      page,
      setPage,
      events,
      deleteTodayMemories,
      restoreDemoData,
      todayMemoryCount,
      queryPhase,
      queryText,
      outcome,
      runQuery,
      selectObject,
      marker,
      markerPulse,
      clearMarker,
      applyMarkerForEvent,
      showOnFloorPlan,
      panelEventId,
      openEventPanel,
      closeEventPanel,
      voiceState,
      startVoice,
      cancelVoice,
    }),
    [
      page,
      events,
      deleteTodayMemories,
      restoreDemoData,
      todayMemoryCount,
      queryPhase,
      queryText,
      outcome,
      runQuery,
      selectObject,
      marker,
      markerPulse,
      clearMarker,
      applyMarkerForEvent,
      showOnFloorPlan,
      panelEventId,
      openEventPanel,
      closeEventPanel,
      voiceState,
      startVoice,
      cancelVoice,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppStateValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
